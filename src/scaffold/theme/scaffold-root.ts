// Community Modules
import fse from 'fs-extra';
import path from 'path';
import fs from 'fs';
import colors from 'colors';

// Package Modules
import { packageRootDir } from '../../../package-root.js';

// Utils
import PathUtils from '../../utils/path-utils.js';

// Functions
import { updateScaffoldFile } from '../common/update-scaffold-file.js';

// Interfaces
import ThemeAnswerValues from '../../interfaces/theme/interface-theme-answer-values.js';
import ScaffoldJsonUpdates from '../../interfaces/common/interface-scaffold-json-updates.js';

/**
 * @description
 * @public
 * @author Keith Murphy | nomadmystics@gmail.com
 *
 * @param {ThemeAnswerValues} values
 * @return {Promise<void>}
 */
const scaffoldThemeRoot = async (values: ThemeAnswerValues): Promise<void> => {
    try {
        let {
            projectName,
            themeDescription,
            frontEndFramework,
            safeThemeName,
            projectNamespace,
        } = values;

        let updateObjectsArray: ScaffoldJsonUpdates[] = [];
        const whereAmI: string = await PathUtils.whereAmI();

        // Create our checks before we start the copy process
        const composerExists: boolean = fse.pathExistsSync(`${whereAmI}/composer.json`);
        const packageExists: boolean = fse.pathExistsSync(`${whereAmI}/package.json`);

        // Default to scaffold /theme-root/project-root
        fse.copySync(`${path.join(`${packageRootDir}/scaffolding/theme-root/project-root`)}`, whereAmI, {overwrite: false});

        // Based on which front-end setting they choose scaffold the project root
        fse.copySync(`${path.join(`${packageRootDir}/scaffolding/theme-root/front-end-scaffolding/${frontEndFramework?.toLowerCase()}/project-root`)}`, whereAmI, {overwrite: false});

        // Our common root files for project and theme
        fse.copySync(`${path.join(`${packageRootDir}/scaffolding/common/root`)}`, whereAmI, { overwrite: false });

        // NPM doesn't like to publish the .gitignore file, so handle that here
        // @todo Maybe check if they already have one?
        if (fs.existsSync(`${whereAmI}/.gitignores`)) {
            const oldPath: string = path.join(whereAmI, '/.gitignores');
            const newPath: string = path.join(whereAmI, '/.gitignore');

            fs.renameSync(oldPath, newPath);
        }

        // Check if the composer.json exists and let the user know
        if (composerExists) {

            console.log(colors.red('Looks like you already have a composer.json file, so this will not be scaffolded'));
            console.log(colors.yellow('See documentation on how to autoload classes with psr-4'));
            console.log("\n");

        } else {

            const composerObjects: Array<ScaffoldJsonUpdates> = [
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

        } else {
            const npmObjects: Array<ScaffoldJsonUpdates> = [
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

        // Update our files based on object properties
        for (let update: number = 0; update < updateObjectsArray.length; update++) {
            if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {

                updateScaffoldFile(
                    whereAmI,
                    updateObjectsArray[update].fileName,
                    updateObjectsArray[update].stringToUpdate,
                    updateObjectsArray[update].updateString,
                );

            }
        }

        // Check if we scaffolded ether of these files
        if (!composerExists || !packageExists) {
            // User messaging
            console.log(colors.yellow(`Don\'t forget to run these commands in the root of the project`));

            if (!composerExists) {
                console.log(colors.green('$ composer run-script auto-load-classes'));
            }

            if (!packageExists) {
                console.log(colors.green('$ nvm use && npm install'));
            }

            console.log("\n");
        }
    } catch (err) {
        console.log('scaffoldThemeRoot()');
        console.error(err);
    }
};

export default scaffoldThemeRoot;
