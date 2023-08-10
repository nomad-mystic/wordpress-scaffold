import fse from 'fs-extra';
import path from 'path';
import fs from 'fs';
import colors from 'colors';
import { packageRootDir } from '../../../package-root.js';
import PathUtils from '../../utils/path-utils.js';
import { updateScaffoldFile } from '../common/update-scaffold-file.js';
const scaffoldThemeRoot = async (values) => {
    try {
        let { projectName, themeDescription, frontEndFramework, safeThemeName, projectNamespace, } = values;
        let updateObjectsArray = [];
        const whereAmI = await PathUtils.whereAmI();
        const composerExists = fse.pathExistsSync(`${whereAmI}/composer.json`);
        const packageExists = fse.pathExistsSync(`${whereAmI}/package.json`);
        fse.copySync(`${path.join(`${packageRootDir}/scaffolding/theme-root/project-root`)}`, whereAmI, { overwrite: false });
        fse.copySync(`${path.join(`${packageRootDir}/scaffolding/theme-root/front-end-scaffolding/${frontEndFramework?.toLowerCase()}/project-root`)}`, whereAmI, { overwrite: false });
        fse.copySync(`${path.join(`${packageRootDir}/scaffolding/common/root`)}`, whereAmI, { overwrite: false });
        if (fs.existsSync(`${whereAmI}/.gitignores`)) {
            const oldPath = path.join(whereAmI, '/.gitignores');
            const newPath = path.join(whereAmI, '/.gitignore');
            fs.renameSync(oldPath, newPath);
        }
        if (composerExists) {
            console.log(colors.red('Looks like you already have a composer.json file, so this will not be scaffolded'));
            console.log(colors.yellow('See documentation on how to autoload classes with psr-4'));
            console.log("\n");
        }
        else {
            const composerObjects = [
                {
                    fileName: 'composer.json',
                    stringToUpdate: 'THEME_NAME',
                    updateString: safeThemeName,
                },
                {
                    fileName: 'composer.json',
                    stringToUpdate: 'PASCAL_NAME',
                    updateString: projectNamespace,
                },
                {
                    fileName: 'composer.json',
                    stringToUpdate: 'THEME_DESCRIPTION',
                    updateString: themeDescription,
                },
            ];
            updateObjectsArray.push(...composerObjects);
        }
        if (packageExists) {
            console.log(colors.red('Looks like you already have a package.json file, so this will not be scaffolded'));
            console.log(colors.yellow('See documentation on Node.js'));
            console.log("\n");
        }
        else {
            const npmObjects = [
                {
                    fileName: 'package.json',
                    stringToUpdate: 'THEME_NAME',
                    updateString: safeThemeName,
                },
                {
                    fileName: 'package.json',
                    stringToUpdate: 'THEME_DESCRIPTION',
                    updateString: themeDescription,
                },
                {
                    fileName: 'webpack.config.js',
                    stringToUpdate: 'PROJECT_NAME',
                    updateString: projectName,
                },
            ];
            updateObjectsArray.push(...npmObjects);
        }
        for (let update = 0; update < updateObjectsArray.length; update++) {
            if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {
                updateScaffoldFile(whereAmI, updateObjectsArray[update].fileName, updateObjectsArray[update].stringToUpdate, updateObjectsArray[update].updateString);
            }
        }
        if (!composerExists || !packageExists) {
            console.log(colors.yellow(`Don\'t forget to run these commands in the root of the project`));
            if (!composerExists) {
                console.log(colors.green('$ composer run-script auto-load-classes'));
            }
            if (!packageExists) {
                console.log(colors.green('$ nvm use && npm install'));
            }
            console.log("\n");
        }
    }
    catch (err) {
        console.log('scaffoldThemeRoot()');
        console.error(err);
    }
};
export default scaffoldThemeRoot;
