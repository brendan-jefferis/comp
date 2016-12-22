const path = require("path");

module.exports = {
    entry: {
        app: path.resolve(__dirname, "src/componentizer.js")
    },
    output: {
        path: path.resolve(__dirname),
        filename: "componentizer.js"
    }
};