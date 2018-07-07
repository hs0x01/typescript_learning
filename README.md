## TypeScriptのサンプル
TypeScriptを中心にGulp、Jasmineなどのサンプルコードを置いています。

## Description
フォルダ、ファイルの説明です。
* before
    - JavaScriptで書いた社員マスタメンテナンス画面です。MVVMモデルで書いています。  
      employeeCrudView.htmlをChromeで開くと動きます。
* after
    - JavaScriptで書いた社員マスタメンテナンス画面をTypeScriptで書き直したものです。
* after_spec
    - Jasmineによる単体テストコードのサンプルです。
* gulpfile.js
    - Gulpによるビルドスクリプトです。
 
## Usage
1. Node.jsをインストール
    * v8.11.3で動くのは確認しました。 
2. package.jsonがあるフォルダに移動して、`npm install`を実行
3. gulpコマンドを実行できるように、`npm install -g gulp@latest`を実行
4. `gulp release`を実行
5. afterフォルダのemployeeCrudView.htmlをChromeで開くと動きます。
6. after_specフォルダのspec_runner.htmlをChromeで開くと単体テストが実行されます。
7. after_docフォルダのindex.htmlをChromeで開くとAPI仕様書が開きます。  

* Gulpのタスク  

| タスク名 | 内容 |
|:-------|:-----|
|compileCoreTs    |コアに属するTypeScriptをJavaScriptにコンパイルします。  |
|compileFeatureTs |個別機能に属するTypeScriptをJavaScriptにコンパイルします。  |
|compileSpecTs    |テストコードのTypeScriptをJavaScriptにコンパイルします。  |
|compileAllTs     |すべてのTypeScriptをJavaScriptにコンパイルします。  |
|compileAllLess   |すべてのLESSをCSSにコンパイルします。  |
|typedoc          |TypeScriptのAPI仕様書を生成します。  |
|minify           |コンパイルで作られたJavaScript、CSSを圧縮します。  |
|watch            |ファイルの追加・更新・削除を監視し、変更があったら、TypeScript、LESSを再コンパイルします。  |
|release          |compileAllTs、compileAllLess、typedoc、minifyの各タスクを実行します。|
