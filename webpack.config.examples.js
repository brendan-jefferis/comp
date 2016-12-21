const path = require("path");
const webpack = require("webpack");

module.exports = {
    devtool: "inline-source-maps",
    entry: {
        example6: path.resolve(__dirname, "src/examples/example6/index")
    },
    output: {
        path: path.resolve(__dirname, "src/examples"),
        filename: "[name]/[name].bundle.js",
        chunkFilename: "[id].bundle.js"
    },
    module: {
        loaders: [
            { test: /\.scss$/, exclude: /node_modules/, loaders: ["style-loader", "css-loader", "sass-loader"] }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ]
};