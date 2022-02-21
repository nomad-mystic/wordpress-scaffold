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
 * @param {string} themesPath
 * @param {string} themeDescription
 * @param {boolean} addWebpack
 * @param {string} safeThemeName
 * @param {string} capAndSnakeCaseTheme
 *
 * @return void
 */
const scaffoldTheme = (answers, {
    themesPath,
    themeDescription,
    addWebpack,
    safeThemeName,
    capAndSnakeCaseTheme,
}) => {
    const newThemePath = `${themesPath}/${safeThemeName}`;

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

        updateScaffoldFile(
            newThemePath,
            'functions.php',
            {
                stringToUpdate: 'THEME_NAME',
                updateString: capAndSnakeCaseTheme,
            }
        );

        updateScaffoldFile(
            newThemePath,
            'functions.php',
            {
                stringToUpdate: 'THEME_VALUE',
                updateString: safeThemeName,
            }
        );

    } catch (err) {

        console.error(err);

    }

};

module.exports = scaffoldTheme;

