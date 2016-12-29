import babel from "rollup-plugin-babel";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
    entry: "src/comp.js",
    banner:
`/* ____ ____ _  _ ___   
*  |___ [__] |\\/| |--' . v${process.env.npm_package_version}
* 
* ${process.env.npm_package_description}
*
* Copyright Brendan Jefferis and other contributors
* Released under the ${process.env.npm_package_license} license
* 
* Issues? Please visit ${process.env.npm_package_bugs_url}
*
* Date: ${new Date().toISOString()} 
*/`,
    targets: [
        {
            dest: "comp.js",
            format: "umd",
            moduleName: "comp",
        },
        {
            dest: "comp.min.js",
            format: "umd",
            moduleName: "comp"
        }
    ],
    plugins: [
        babel({
            babelrc: false,
            exclude: "node_modules/**",
            presets: "es2015-rollup"
        }),
        nodeResolve(),
        commonjs()
    ]
}