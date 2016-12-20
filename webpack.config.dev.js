const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: {
        app: path.resolve(__dirname, "src/componentizer")
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "componentizer.js"
    },
    module: {
        loaders: [

        ]
    },
    plugins: [

    ]
};