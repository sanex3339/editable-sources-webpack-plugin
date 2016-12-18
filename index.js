const SourceMapSource = require("webpack-sources").SourceMapSource;
const RawSource = require("webpack-sources").RawSource;
const transferSourceMap = require("multi-stage-sourcemap").transfer;

class EditableSourcesWebpackPlugin {
    constructor (matchRegExp, callback) {
        this.matchRegExp = matchRegExp;
        this.callback = callback;
    }

    apply (compiler) {
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin("optimize-chunk-assets", (chunks, callback) => {
                const files = [];

                chunks.forEach((chunk) => {
                    chunk['files'].forEach((file) => {
                        files.push(file);
                    });
                });

                compilation.additionalChunkAssets.forEach((file) => {
                    files.push(file);
                });

                files.forEach((file) => {
                    if (!this.matchRegExp.test(file)) {
                        return;
                    }

                    const asset = compilation.assets[file];

                    let inputSourceMap,
                        sourceCode;

                    if (asset.sourceAndMap) {
                        const sourceAndMap = asset.sourceAndMap();

                        inputSourceMap = sourceAndMap.map;
                        sourceCode = sourceAndMap.source;
                    } else {
                        inputSourceMap = asset.map();
                        sourceCode = asset.source();
                    }

                    const data = this.callback(sourceCode);

                    let newSourceCode = null,
                        newSourceMap = null,
                        outputSourceMap = null;

                    if (typeof data === 'object' && data.sourceCode) {
                        newSourceCode = data.sourceCode;
                        newSourceMap = data.sourceMap;
                    } else {
                        newSourceCode = data;
                    }

                    if (!newSourceCode) {
                        return;
                    }

                    if (inputSourceMap) {
                        if (newSourceMap) {
                            outputSourceMap = JSON.parse(
                                transferSourceMap({
                                    fromSourceMap: newSourceMap,
                                    toSourceMap: inputSourceMap
                                })
                            );
                        } else {
                            outputSourceMap = inputSourceMap;
                        }

                        return compilation.assets[file] = new SourceMapSource(
                            newSourceCode,
                            file,
                            outputSourceMap,
                            asset.source(),
                            inputSourceMap
                        );
                    }

                    return compilation.assets[file] = new RawSource(newSourceCode);
                });

                callback();
            });
        });
    }
}

module.exports = EditableSourcesWebpackPlugin;