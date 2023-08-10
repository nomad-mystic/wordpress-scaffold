const fs = require('fs');
const uglifyJS = require('uglify-js');
const { globSync } = require('glob');
const packageRoot = require('../../package-root.js');
export default class ProductionBuild {
    static minifyProduction = () => {
        const jsFiles = globSync(`${packageRoot.packageRootDir}/src/**/*.js`, {
            ignore: 'node_modules/**',
            absolute: true,
        });
        if (jsFiles && typeof jsFiles !== 'undefined' && jsFiles.length > 0) {
            for (let file = 0; file < jsFiles.length; file++) {
                if (jsFiles[file] && typeof jsFiles[file] !== 'undefined') {
                    console.log(fs.readFileSync(jsFiles[file], 'utf-8'));
                    uglifyJS.minify(fs.readFileSync(jsFiles[file], 'utf-8'), {});
                }
            }
        }
    };
}
ProductionBuild.minifyProduction();
