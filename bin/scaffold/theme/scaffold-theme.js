// Community modules
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const colors = require('colors');

// Package Modules
const {
    whereAmI,
    isWordpressInstall,
    getThemesFolderPath,
} = require('../../utils/path-utils');

const {
    addDashesToString,
    capAndSnakeCaseString,
    pascalCaseString,
} = require('../../utils/string-utils');

const {
    updateScaffoldFile,
} = require('../../utils/update-scaffold-file');

/**
 * @description Based on user input scaffold our theme
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
const scaffoldTheme = (answers, {
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
        if (fs.existsSync(newThemePath)) {
            console.log(colors.red('There is already a theme with that name. Please use another name.'));

            process.exit(0);
        }

        // Copy our files over to the themes folder
        fse.copySync(`${path.join(__dirname + '../../../../scaffolding/theme')}`, newThemePath, {overwrite: false});

        // Sometimes users might not want to have a build system
        if (addWebpack) {
            fse.copySync(`${path.join(__dirname + '../../../../scaffolding/theme-root/theme-extra-folders')}`, newThemePath, {overwrite: false});
        }

        // Our updates
        const updateObjectsArray = [
            {
                fileName: 'functions.php',
                stringToUpdate: 'THEME_NAME',
                updateString: capAndSnakeCaseTheme,
            },
            {
                fileName: 'functions.php',
                stringToUpdate: 'THEME_VALUE',
                updateString: safeThemeName,
            },
            {
                fileName: 'style.css',
                stringToUpdate: 'THEME_VALUE',
                updateString: safeThemeName,
            },
            {
                fileName: 'style.css',
                stringToUpdate: 'THEME_NAME',
                updateString: themeName,
            },
            {
                fileName: 'style.css',
                stringToUpdate: 'THEME_DESCRIPTION',
                updateString: themeDescription,
            },
        ];

        // Update our files based on object properties
        for (let update = 0; update < updateObjectsArray.length; update++) {
            if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {

                updateScaffoldFile(
                    newThemePath,
                    updateObjectsArray[update].fileName,
                    {
                        stringToUpdate: updateObjectsArray[update].stringToUpdate,
                        updateString: updateObjectsArray[update].updateString,
                    }
                );
            }
        }

    } catch (err) {

        console.error(err);

    }

};

module.exports = scaffoldTheme;

