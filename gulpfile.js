// モジュールの読み込み
var gulp       = require('gulp');
var gulpTs     = require('gulp-typescript');
var merge      = require('merge2');
var watch      = require("gulp-watch");
var gulpLess   = require('gulp-less');
var del        = require('del');
var plumber    = require('gulp-plumber');
var typedoc    = require("gulp-typedoc");

// 定数定義
var TS_TARGET       = 'ES5';
var JS_OUTPUT_PATH  = 'after/js/';
var CSS_OUTPUT_PATH = 'after/css';
var CORE_D_TS       = 'core.d.ts';
var CORE_JS         = 'core.js';
var FEATURE_JS      = 'feature.js';
var LESS_FILES      = 'after/less/**/*.less';

var CORE_TS_FILES = ['after/Scripts/extensions/*.ts',
					 'after/Scripts/lib/*.ts',
					 'after/Scripts/models/*.ts',
					 'after/Scripts/repositories/*.ts',
					 'after/Scripts/utils/*.ts'];
					 
var FEATURE_TS_FILES = ['after/Scripts/lib/*.d.ts',
						'after/Scripts/viewmodels/*.ts',
						JS_OUTPUT_PATH + CORE_D_TS];

// core.jsのためのTypeScriptコンパイル設定
var compileSettingsForCore = gulpTs.createProject({
	target           : TS_TARGET,
	declaration      : true,
    noExternalResolve: true,
    out              : CORE_JS
});

// feature.jsのためのTypeScriptコンパイル設定
var compileSettingsForFeature = gulpTs.createProject({
	target           : TS_TARGET,
	declaration      : true,
    noExternalResolve: true,
    out              : FEATURE_JS
});

// Coreに属するTypeScriptのコンパイル
gulp.task('compileCoreTs', compileCoreTs);

// Featureに属するTypeScriptのコンパイル
gulp.task('compileFeatureTs', compileFeatureTs);

// すべてのTypeScriptのコンパイル
gulp.task('compileAllTs', function () {

	// Core -> Featureの順にコンパイルが実行されるように制御
	var stream = watch(JS_OUTPUT_PATH + CORE_D_TS, function() {
		stream.close();
		compileFeatureTs();
	});
	
	compileCoreTs();
});

// すべてのLESSのコンパイル
gulp.task('compileAllLess', compileAllLess);

// TypeDocの生成
gulp.task('typedoc', function() {
    return gulp
        .src(['after/Scripts/**/*.ts'])
        .pipe(typedoc({ 
            target: TS_TARGET,
            includeDeclarations: true,
            out: "after_doc", 
            json: "after_doc/to/file.json",
            name: "after", 
            ignoreCompilerErrors: false,
            version: true,
        }))
    ;
});

// ファイルの追加・更新・削除を監視し、変更があったら再コンパイル実行
gulp.task('watch', function() {

	// core.jsのためのTypeScriptコンパイル
    watch(CORE_TS_FILES, compileCoreTs);
    
    // feature.jsのためのTypeScriptコンパイル
    watch(FEATURE_TS_FILES, compileFeatureTs)
    
    // LESSのコンパイル
	watch(LESS_FILES, compileAllLess);
    
    // core.js更新通知
    watch(JS_OUTPUT_PATH + CORE_JS, function() {
    	console.log('Update core.js');
    });
    // feature.js更新通知
    watch(JS_OUTPUT_PATH + FEATURE_JS, function() {
    	console.log('Update feature.js');
    })
});

// Coreに属するTypeScriptをコンパイルする関数
function compileCoreTs() {

	console.log('Start compileCoreTs');

	var result = gulp.src(CORE_TS_FILES).pipe(gulpTs(compileSettingsForCore));
	
	return merge([result.dts.pipe(gulp.dest(JS_OUTPUT_PATH)),
				  result.js.pipe(gulp.dest(JS_OUTPUT_PATH))]);
}

// Featureに属するTypeScriptをコンパイルする関数
function compileFeatureTs() {

	console.log('Start compileFeatureTs');

	return merge(gulp.src(FEATURE_TS_FILES)
				.pipe(gulpTs(compileSettingsForFeature))
				.js.pipe(gulp.dest(JS_OUTPUT_PATH)));
}

// すべてのLESSをコンパイルする関数
function compileAllLess() {
	
	del.sync(CSS_OUTPUT_PATH + '/**/*');
	
	return gulp.src(LESS_FILES)
		.pipe(plumber({
			'errorHandler': function(error) {
				console.log(error);
				this.emit('end');
			}
		}))
        .pipe(gulpLess())
        .pipe(gulp.dest(CSS_OUTPUT_PATH));
}

