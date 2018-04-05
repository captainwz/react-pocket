var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, './dest/index.js'),
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                loader: 'babel-loader',
                options: {
                    presets: ['stage-0', 'react', 'env']
                },
            }
        ]
    },
    devtool: "source-map"
}