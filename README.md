#Editable sources plugin for Webpack

[![npm version](https://badge.fury.io/js/editable-sources-webpack-plugin.svg)](https://badge.fury.io/js/editable-sources-webpack-plugin)

### Overview
**editable-sources-webpack-plugin** allows to modify source code of any `webpack` bundle during bundling. For example if some `npm` package doesn't have `webpack` plugin, you can use this package inside **editable-sources-webpack-plugin** `callback` function.

### Installation

Install the package with NPM and add it to your devDependencies:

`npm install --save-dev editable-sources-webpack-plugin`

### Usage:

`new EditableSourcesWebpackPlugin(matchRegExp, callback);`

```javascript
const webpack = require('webpack');
const EditableSourcesWebpackPlugin = require('editable-sources-webpack-plugin');
const NpmPackageWithoutWebpackSupport = require('some-npm-package');

module.exports = {
    devtool: 'source-map',
    entry: {
        app: './src/app.ts'
    },
    output: {
        filename: '[name].js',
    },
    plugins: [
        new EditableSourcesWebpackPlugin(/\.js$/, function (sourceCode) {
            sourceCode = sourceCode
                .replace(/\.catch\(/g, `['catch'](`)
                .replace(/\.throw\(/g, `['throw'](`);
            
            return NpmPackageWithoutWebpackSupport(sourceCode);
        })
    ],
    resolve: {
        extensions: ['.ts', '.js']
    }
};
```

### Test
1. `git clone`
2. `npm install`
3. `npm test`
4. open `dist/bundle.js` to check your upgraded code.

### API
#### EditableSourcesWebpackPlugin
Type: `constructor`
Arguments: 
`matchRegExp` - RegExp to test bundle name (include extension) that will passed to `callback`
`callback` - callback function for modifying code. Should return changed source code.

Any bundle that matched `matchRegExp` will be passed to the `callback` as `sourceCode` argument. Should return changed source code.

If bundle contains source map, new source map will be generated for the edited source code.

If new source map was generated inside callback, you should returns object with `sourceCode` and `sourceMap` properties instead `string`.
```javascript
new EditableSourcesWebpackPlugin(/\.js$/, function (sourceCode) {
    var data = NpmPackageWithoutWebpackSupport(sourceCode);
    
    return {
        sourceCode: data.sourceCode,
        sourceMap: data.sourceMap
    };
})
```

### License
Copyright (C) 2016 [Timofey Kachalov](http://github.com/sanex3339).

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.