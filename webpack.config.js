const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js', // エントリーポイントのファイル
    output: {
        filename: 'bundle.js', // 出力されるバンドルファイルの名前
        path: path.resolve(__dirname, 'dist'), // 出力先ディレクトリ
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // 元となるHTMLファイルのパス
            filename: 'index.html' // 出力されるHTMLファイルの名前
        })
    ],
    mode: 'development', // 開発モード
    // プロダクション環境の場合は 'production' を使用
};
