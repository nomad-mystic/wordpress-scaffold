// Community modules
const fse = require('fs-extra');
const path = require('path');

// Package Modules
const {
    whereAmI,
    isWordpressInstall,
    getThemesFolderPath,
} = require('../../utils/path-utils');

const {
    updateScaffoldFile,
} = require('../../utils/update-scaffold-file');
const fs = require("fs-extra");
const colors = require("colors");

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
    addWebpack,
    safeThemeName,
    capAndSnakeCaseTheme,
    pascalThemeName,
}) => {
    try {
        const composerExists = fs.pathExistsSync(`${whereAmI()}/composer.json`);

        // Default to scaffold /theme-root/root
        fse.copySync(`${path.join(__dirname + '../../../../scaffolding/theme-root/root')}`, whereAmI(), {overwrite: false});

        // Sometimes users might not want to have a build system
        if (addWebpack) {
            // fse.copySync(`${path.join(__dirname + '../../../../scaffolding/theme-root/theme-extra-folders')}`, newThemePath, {overwrite: false});
        }

        // Check if the composer.json exists and let the user know
        if (composerExists) {

            console.log(colors.red('Looks like you already have a composer.json file, so this will not be scaffolded'));
            console.log(colors.yellow('See documentation on how to autoload classes with psr-4'));

        } else {

            const updateObjectsArray = [
                {
                    stringToUpdate: 'THEME_NAME',
                    updateString: safeThemeName,
                },
                {
                    stringToUpdate: 'PASCAL_NAME',
                    updateString: pascalThemeName,
                },
                {
                    stringToUpdate: 'THEME_DESCRIPTION',
                    updateString: themeDescription,
                },
            ];

            // Update our files based on object properties
            for (let update = 0; update < updateObjectsArray.length; update++) {
                if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {

                    updateScaffoldFile(
                        whereAmI(),
                        'composer.json',
                        {
                            stringToUpdate: updateObjectsArray[update].stringToUpdate,
                            updateString: updateObjectsArray[update].updateString,
                        }
                    );

                }
            }

            console.log(colors.yellow('Don\'t forget to run the composer "auto-load-classes" script in the root of the project.'));
        }
    } catch (err) {

        console.error(err);

    }
};

module.exports = scaffoldThemeRoot;
