// モジュールの読み込み
var gulp   = require('gulp');
var gulpTs = require('gulp-typescript');
var merge  = require('merge2');
var watch  = require("gulp-watch");

// 定数定義
var TS_TARGET      = 'ES5';
var JS_OUTPUT_PATH = 'after/js/';
var CORE_D_TS      = 'core.d.ts';
var CORE_JS        = 'core.js';
var FEATURE_JS     = 'feature.js';

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

// ファイルの追加・更新・削除を監視し、変更があったら再コンパイル実行
gulp.task('watch', function() {

    watch(CORE_TS_FILES,    compileCoreTs);
    watch(FEATURE_TS_FILES, compileFeatureTs);
    
    watch(JS_OUTPUT_PATH + CORE_JS, function() {
    	console.log('Update core.js');
    });
    watch(JS_OUTPUT_PATH + FEATURE_JS, function() {
    	console.log('Update feature.js');
    });
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
