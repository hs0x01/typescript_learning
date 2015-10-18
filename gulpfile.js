// ----------------------------------------------------------------------------
//   モジュールロード
// ----------------------------------------------------------------------------
var gulp     = require('gulp');
var gulpTs   = require('gulp-typescript');
var merge    = require('merge2');
var watch    = require('gulp-watch');
var gulpLess = require('gulp-less');
var del      = require('del');
var plumber  = require('gulp-plumber');
var typedoc  = require('gulp-typedoc');
var color    = require('cli-color');

// ----------------------------------------------------------------------------
//   定数
// ----------------------------------------------------------------------------
var TS_TARGET       = 'ES5';
var JS_OUTPUT_PATH  = 'after/js/';
var CSS_OUTPUT_PATH = 'after/css';
var CORE_D_TS       = 'core.d.ts';
var CORE_JS         = 'core.js';
var FEATURE_D_TS    = 'feature.d.ts';
var FEATURE_JS      = 'feature.js';
var SPEC_JS         = 'spec.js';
var LESS_FILES      = 'after/less/**/*.less';

var CORE_TS_FILES = ['after/Scripts/extensions/*.ts',
					 'after/Scripts/lib/*.ts',
					 'after/Scripts/models/*.ts',
					 'after/Scripts/repositories/*.ts',
					 'after/Scripts/utils/*.ts'];
					 
var FEATURE_TS_FILES = ['after/Scripts/lib/*.d.ts',
						'after/Scripts/viewmodels/*.ts',
						JS_OUTPUT_PATH + CORE_D_TS];

var SPEC_TS_FILES    = ['after/Scripts/**/*.ts', 'after/Specs/**/*.ts'];

// core.jsのためのTypeScriptコンパイル設定
var COMPILE_SETTINGS_FOR_CORE = gulpTs.createProject({
	target           : TS_TARGET,
	declaration      : true,
    noExternalResolve: true,
    out              : CORE_JS
});

// feature.jsのためのTypeScriptコンパイル設定
var COMPILE_SETTINGS_FOR_FEATURE = gulpTs.createProject({
	target           : TS_TARGET,
    noExternalResolve: true,
    out              : FEATURE_JS
});

// spec.jsのためのTypeScriptコンパイル設定
var COMPILE_SETTINGS_FOR_SPEC = gulpTs.createProject({
	target           : TS_TARGET,
    noExternalResolve: true,
    out              : SPEC_JS
});

// ----------------------------------------------------------------------------
//   タスク
// ----------------------------------------------------------------------------

// Coreに属するTypeScriptのコンパイル
gulp.task('compileCoreTs', compileCoreTs);

// Featureに属するTypeScriptのコンパイル
gulp.task('compileFeatureTs', compileFeatureTs);

// Specに属するTypeScriptのコンパイル
gulp.task('compileSpecTs', compileSpecTs);

// すべてのTypeScriptのコンパイル
gulp.task('compileAllTs', function (callback) {

    compileCoreTs().on('finish', function () {
        compileFeatureTs();
    });

    compileSpecTs();

});

// すべてのLESSのコンパイル
gulp.task('compileAllLess', compileAllLess);

// TypeDocの生成
gulp.task('typedoc', createTypedoc);

// ファイルの追加・更新・削除を監視し、変更があったら再コンパイル実行
gulp.task('watch', function() {

	// core.jsのためのTypeScriptコンパイル
    watch(CORE_TS_FILES, compileCoreTs);
    
    // feature.jsのためのTypeScriptコンパイル
    watch(FEATURE_TS_FILES, compileFeatureTs)
    
    // LESSのコンパイル
	watch(LESS_FILES, compileAllLess);
});

// ----------------------------------------------------------------------------
//   関数
// ----------------------------------------------------------------------------

// Coreに属するTypeScriptをコンパイルする関数
function compileCoreTs() {

	writeInfMsg('TypeScript[Core]のコンパイルを開始しました。');

	var result = gulp.src(CORE_TS_FILES).pipe(gulpTs(COMPILE_SETTINGS_FOR_CORE));
	
	return merge([result.dts.pipe(gulp.dest(JS_OUTPUT_PATH)),
				  result.js.pipe(gulp.dest(JS_OUTPUT_PATH))]).on('finish', function () {
				      writeInfMsg('TypeScript[Core]のコンパイルが終了しました。');
				  });
}

// Featureに属するTypeScriptをコンパイルする関数
function compileFeatureTs() {

	writeInfMsg('TypeScript[Feature]のコンパイルを開始しました。');

	var result = gulp.src(FEATURE_TS_FILES).pipe(gulpTs(COMPILE_SETTINGS_FOR_FEATURE));
	
	return merge([result.js.pipe(gulp.dest(JS_OUTPUT_PATH))]).on('finish', function () {
	    writeInfMsg('TypeScript[Feature]のコンパイルが終了しました。');
	});
}

// Specに属するTypeScriptをコンパイルする関数
function compileSpecTs() {

	writeInfMsg('TypeScript[Spec]のコンパイルを開始しました。');

	var result = gulp.src(SPEC_TS_FILES).pipe(gulpTs(COMPILE_SETTINGS_FOR_SPEC));
	
	return merge([result.js.pipe(gulp.dest(JS_OUTPUT_PATH))]).on('finish', function () {
	    writeInfMsg('TypeScript[Spec]のコンパイルが終了しました。');
	});
}

// すべてのLESSをコンパイルする関数
function compileAllLess() {
	
	writeInfMsg('すべてのLESSのコンパイルを開始しました。');
	
	del.sync(CSS_OUTPUT_PATH + '/**/*');
	
	return gulp.src(LESS_FILES)
		.pipe(plumber({
			'errorHandler': function(error) {
				writeErrMsg(error);
			}
		}))
        .pipe(gulpLess())
        .pipe(gulp.dest(CSS_OUTPUT_PATH)).on('finish', function () {
            writeInfMsg('すべてのLESSのコンパイルが終了しました。');
        });
}

// TypeDocを生成する関数
function createTypedoc() {
    
    writeInfMsg('TypeDoc生成を開始しました。');

    return gulp
        .src(['after/Scripts/**/*.ts'])
        .pipe(typedoc({
            target : TS_TARGET,
            out    : 'after_doc',
            name   : 'after',
            version: true,
            includeDeclarations : true,
            ignoreCompilerErrors: false,
        }))
        .on('finish', function () {
            writeInfMsg('TypeDoc生成が終了しました。');
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
	
	var hh = ('0' + date.getHours()).slice(-2);
	var mm = ('0' + date.getMinutes()).slice(-2);
	var ss = ('0' + date.getSeconds()).slice(-2);
	
	return (hh + ':' + mm + ':' + ss);
}


