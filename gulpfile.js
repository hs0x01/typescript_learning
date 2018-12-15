'use strict'

// ----------------------------------------------------------------------------
//   モジュールロード
// ----------------------------------------------------------------------------
const gulp      = require('gulp');
const gulpTs    = require('gulp-typescript');
const srcMaps   = require('gulp-sourcemaps');
const merge     = require('merge2');
const watch     = require('gulp-watch');
const gulpLess  = require('gulp-less');
const del       = require('del');
const plumber   = require('gulp-plumber');
const typedoc   = require('gulp-typedoc');
const uglify    = require('gulp-uglify');
const minifyCss = require('gulp-clean-css');
const color     = require('cli-color');
const fs        = require('fs');

// ----------------------------------------------------------------------------
//   定数
// ----------------------------------------------------------------------------
const JS_OUTPUT_PATH  = 'after/js/';
const CSS_OUTPUT_PATH = 'after/css/';
const CORE_D_TS       = 'core.d.ts';
const CORE_JS         = 'core.js';
const FEATURE_JS      = 'feature.js';
const SPEC_JS         = 'spec.js';
const LESS_FILES      = 'after/less/**/*.less';

const CORE_TS_FILES = ['after/Scripts/extensions/*.ts',
					 'after/Scripts/lib/*.ts',
					 'after/Scripts/models/*.ts',
					 'after/Scripts/repositories/*.ts',
					 'after/Scripts/utils/*.ts'];
					 
const FEATURE_TS_FILES = ['after/Scripts/lib/*.d.ts',
						'after/Scripts/viewmodels/*.ts',
						JS_OUTPUT_PATH + CORE_D_TS];

const SPEC_TS_FILES    = ['after/Scripts/**/*.ts', 'after/Specs/**/*.ts'];

const TS_CONFIG_NAME   = 'tsconfig.json';

const TS_CONFIG_JSON   = JSON.parse(fs.readFileSync(TS_CONFIG_NAME));

// core.jsのためのTypeScriptコンパイル設定
const COMPILE_SETTINGS_FOR_CORE = gulpTs.createProject(
    TS_CONFIG_NAME,
    {
        declaration      : true,
        out              : CORE_JS
    });

// feature.jsのためのTypeScriptコンパイル設定
const COMPILE_SETTINGS_FOR_FEATURE = gulpTs.createProject(
    TS_CONFIG_NAME,
    {
        out              : FEATURE_JS
    });

// spec.jsのためのTypeScriptコンパイル設定
const COMPILE_SETTINGS_FOR_SPEC = gulpTs.createProject(
    TS_CONFIG_NAME,
    {
        out              : SPEC_JS
    });

// gulpのコールバック関数を実行するかどうか判断するクラス
class Callback {

    constructor(maxCnt, callback) {
        this.cnt = 0;
        this.maxCnt = maxCnt;
        this.callback = callback;
    }

    callbackIfDone() {

        this.cnt++;

        if (this.cnt === this.maxCnt) {
            this.callback();
        }
    }
}

// ----------------------------------------------------------------------------
//   タスク
// ----------------------------------------------------------------------------

// Coreに属するTypeScriptのコンパイル
gulp.task('compileCoreTs', (callback) => {
    compileCoreTs(callback);
});

// Featureに属するTypeScriptのコンパイル
gulp.task('compileFeatureTs', (callback) => {
    compileFeatureTs(callback);
});

// Specに属するTypeScriptのコンパイル
gulp.task('compileSpecTs', (callback) => {
    compileSpecTs(callback);
});

// すべてのTypeScriptのコンパイル
gulp.task('compileAllTs', (callback) => {

    let cb = new Callback(2, callback);

    compileCoreTs(() => {
        compileFeatureTs(() => {
            cb.callbackIfDone();
        });
    });

    compileSpecTs(() => {
        cb.callbackIfDone();
    });
});

// すべてのLESSのコンパイル
gulp.task('compileAllLess', (callback) => {
    compileAllLess(callback);
});

// 圧縮
gulp.task('minify', (callback) => {

    let cb = new Callback(2, callback);

    minifyJsFiles(() => {
        cb.callbackIfDone();
    });
    minifyCssFiles(() => {
        cb.callbackIfDone();
    });
});

// リリース
gulp.task('release', (callback) => {

    let cb = new Callback(3, callback);

    compileSpecTs(() => {
       cb.callbackIfDone();
    });

    compileAllLess(() => {
        minifyCssFiles(() => {
            cb.callbackIfDone();
        });
    });

    compileCoreTs(() => {
        compileFeatureTs(() => {
            minifyJsFiles(() => {
                cb.callbackIfDone();
            });
        });
    });
});

// ----------------------------------------------------------------------------
//   関数
// ----------------------------------------------------------------------------

// Coreに属するTypeScriptをコンパイルする関数
function compileCoreTs(callback) {

	writeInfMsg('TypeScript[Core]のコンパイルを開始しました。');

    let result = gulp.src(CORE_TS_FILES)
        .pipe(srcMaps.init())
        .pipe(plumber({
            'errorHandler': (error) => {
                writeErrMsg(error);
                if (callback) callback();
            }
        }))
        .pipe(COMPILE_SETTINGS_FOR_CORE())
        .pipe(srcMaps.write('./'))
        .pipe(gulp.dest(JS_OUTPUT_PATH))
        .on('finish', () => {
            writeInfMsg('TypeScript[Core]のコンパイルが終了しました。');
            if (callback) callback();
        });

    return result;
}

// Featureに属するTypeScriptをコンパイルする関数
function compileFeatureTs(callback) {

	writeInfMsg('TypeScript[Feature]のコンパイルを開始しました。');

    let result = gulp.src(FEATURE_TS_FILES)
        .pipe(srcMaps.init())
        .pipe(plumber({
            'errorHandler': (error) => {
                writeErrMsg(error);
                if (callback) callback();
            }
        }))
        .pipe(COMPILE_SETTINGS_FOR_FEATURE())
        .pipe(srcMaps.write('./'))
        .pipe(gulp.dest(JS_OUTPUT_PATH))
        .on('finish', () => {
            writeInfMsg('TypeScript[Feature]のコンパイルが終了しました。');
            if (callback) callback();
        });
    
    return result;
}

// Specに属するTypeScriptをコンパイルする関数
function compileSpecTs(callback) {

	writeInfMsg('TypeScript[Spec]のコンパイルを開始しました。');

    let result = gulp.src(SPEC_TS_FILES)
                    .pipe(srcMaps.init())
                    .pipe(COMPILE_SETTINGS_FOR_SPEC())
                    .pipe(srcMaps.write('./'))
                    .pipe(gulp.dest(JS_OUTPUT_PATH))
                    .on('finish', () => {
                        writeInfMsg('TypeScript[Spec]のコンパイルが終了しました。');
                        if (callback) callback();
                    });
    
    return result;
}

// すべてのLESSをコンパイルする関数
function compileAllLess(callback) {
	
	writeInfMsg('すべてのLESSのコンパイルを開始しました。');
	
	del.sync(CSS_OUTPUT_PATH + '**/*');
	
	return gulp.src(LESS_FILES)
		.pipe(plumber({
			'errorHandler': (error) => {
                writeErrMsg(error);
                if (callback) callback();
			}
		}))
        .pipe(gulpLess())
        .pipe(gulp.dest(CSS_OUTPUT_PATH)).on('finish', () => {
            writeInfMsg('すべてのLESSのコンパイルが終了しました。');
            if (callback) callback();
        });
}

// JavaScriptファイルを圧縮する関数
function minifyJsFiles(callback) {

    writeInfMsg('JSファイルの圧縮を開始しました。');

    return gulp.src(JS_OUTPUT_PATH + '**/*.js')
                .pipe(uglify())
                .pipe(gulp.dest(JS_OUTPUT_PATH))
                .on('finish', () => {
                    writeInfMsg('JSファイルの圧縮が終了しました。');
                    if (callback) callback();
                });
}

// CSSファイルを圧縮する関数
function minifyCssFiles(callback) {

    writeInfMsg('CSSファイルの圧縮を開始しました。');

    return gulp.src(CSS_OUTPUT_PATH + '**/*.css')
                .pipe(minifyCss())
                .pipe(gulp.dest(CSS_OUTPUT_PATH))
                .on('finish', () => {
                    writeInfMsg('CSSファイルの圧縮が終了しました。');
                    if (callback) callback();
                });
}


// INFOメッセージをコンソール出力する関数
function writeInfMsg(msg) {
	console.log(color.cyanBright('[' + getHhmmss(new Date()) + '] ' + msg));
}

// ERRORメッセージをコンソール出力する関数
function writeErrMsg(msg) {
	console.log(color.redBright('[' + getHhmmss(new Date()) + '] ' + msg));
}

// 引数のDateオブジェクトから時分秒を取得し、hh:mm:ss形式で返す関数
function getHhmmss(date) {
	
	let hh = ('0' + date.getHours()).slice(-2);
	let mm = ('0' + date.getMinutes()).slice(-2);
	let ss = ('0' + date.getSeconds()).slice(-2);
	
	return (hh + ':' + mm + ':' + ss);
}
