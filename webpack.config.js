const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const EditableSourcesWebpackPlugin = require('./index');

module.exports = {
    mode: 'development',
    entry: './test.js',
    devtool: 'source-map',
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new EditableSourcesWebpackPlugin(/\.js$/, function (sourceCode) {
            return `// ******** hello world! This is the embeded comment ********
                ${sourceCode}
            // ******** embeded comment end *******`;
        })
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
  };