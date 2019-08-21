const path = require("path");
const nodeExternals = require("webpack-node-externals");
const TypedocWebpackPlugin = require("typedoc-webpack-plugin");

module.exports = {
// モード値を production に設定すると最適化された状態で、
// development に設定するとソースマップ有効でJSファイルが出力される
  mode: "development", // "production" | "development" | "none"

// メインとなるJavaScriptファイル（エントリーポイント）
  entry: "./src/index.ts",

  output: {
    path: path.join(__dirname),
    filename: "m5stack.js",
    pathinfo: false,
    library: "M5Stack",
  },
  devtool: "none",

  module: {
    rules: [{
      // 拡張子 .ts の場合
      test: /\.ts$/,
      // TypeScript をコンパイルする
      use: "ts-loader",
    }],
  },
// import 文で .ts ファイルを解決するため
  resolve: {
    modules: [
      "node_modules", // node_modules 内も対象とする
    ],
    extensions: [
      ".ts",
      ".js", // node_modulesのライブラリ読み込みに必要
    ],
  },
  externals: [
    nodeExternals({
      modulesFromFile: {
        include: ["devDependencies"],
      },
    }),
  ],
  plugins: [
    new TypedocWebpackPlugin({
      out: "./docs",
      mode : "modules",
      tsconfig : "./tsconfig.json",
      name : "M5Stack.js",
      exclude : ["**/node_modules/!(obniz)/**/*.*", "**/node_modules/obniz/**/node_modules/**/*.*"],
      ignoreCompilerErrors : true,
      includeDeclarations : true,
      readme : "./README.md"
    }),
  ],
};
