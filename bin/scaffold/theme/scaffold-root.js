// Community modules
const fse = require('fs-extra');
const path = require('path');
const fs = require('fs-extra');
const colors = require('colors');

// Package Modules
const {
    whereAmI,
    isWordpressInstall,
    getThemesFolderPath,
} = require('../../utils/path-utils');

const {
    updateScaffoldFile,
} = require('../../utils/update-scaffold-file');

/**
 * @description
 *
 * @param {Object} answers
 * @param {string} answers.themeName
 * @param {string} answers.themeDescription
 * @param {boolean} answers.addWebpack
 * @param {string} themeName
 * @param {string} themesPath
 * @param {string} newThemePath
 * @param {string} themeDescription
 * @param {string} frontEndFramework
 * @param {boolean} addWebpack
 * @param {string} safeThemeName
 * @param {string} capAndSnakeCaseTheme
 * @param {string} pascalThemeName
 *
 * @return void
 */
const scaffoldThemeRoot = (answers, {
    themeName,
    themesPath,
    newThemePath,
    themeDescription,
    frontEndFramework,
    safeThemeName,
    capAndSnakeCaseTheme,
    pascalThemeName,
}) => {
    try {
        let updateObjectsArray = [];

        // Create our checks before we start the copy process
        const composerExists = fs.pathExistsSync(`${whereAmI()}/composer.json`);
        const packageExists = fs.pathExistsSync(`${whereAmI()}/package.json`);

        // Default to scaffold /theme-root/root
        fse.copySync(`${path.join(__dirname + '../../../../scaffolding/theme-root/root')}`, whereAmI(), {overwrite: false});

        // Sometimes users might not want to have a build system
        if (typeof frontEndFramework !== 'undefined' && frontEndFramework !== 'None') {
            fse.copySync(`${path.join(__dirname + '../../../../scaffolding/theme-root/front-end-scaffolding')}`, whereAmI(), {overwrite: false});
        }

        // Check if the composer.json exists and let the user know
        if (composerExists) {

            console.log(colors.red('Looks like you already have a composer.json file, so this will not be scaffolded'));
            console.log(colors.yellow('See documentation on how to autoload classes with psr-4'));
            console.log("\n");

        } else {

            const composerObjects = [
                {
                    fileName: 'composer.json',
                    stringToUpdate: 'THEME_NAME',
                    updateString: safeThemeName,
                },
                {
                    fileName: 'composer.json',
                    stringToUpdate: 'PASCAL_NAME',
                    updateString: pascalThemeName,
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
                    stringToUpdate: 'THEME_NAME',
                    updateString: safeThemeName,
                },
            ];

            updateObjectsArray.push(...npmObjects);
        }

        // Update our files based on object properties
        for (let update = 0; update < updateObjectsArray.length; update++) {
            if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {

                // console.log(updateObjectsArray[update].fileName);

                updateScaffoldFile(
                    whereAmI(),
                    updateObjectsArray[update].fileName,
                    {
                        stringToUpdate: updateObjectsArray[update].stringToUpdate,
                        updateString: updateObjectsArray[update].updateString,
                    }
                );

            }
        }

        // Check if we scaffolded ether of these files
        if (!composerExists || !packageExists) {
            // User messaging
            console.log(colors.yellow(`Don\'t forget to run these commands in the root of the project`));

            if (!composerExists) {
                console.log(colors.green('composer run-script auto-load-classes'));
            }

            if (!packageExists) {
                console.log(colors.green('nvm use && npm install'));
            }

            console.log("\n");
        }
    } catch (err) {

        console.error(err);

    }
};

module.exports = scaffoldThemeRoot;
