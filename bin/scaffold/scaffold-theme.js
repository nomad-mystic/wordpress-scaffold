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
} = require('../utils/path-utils');

const {
    addDashesToString,
    capAndSnakeCaseString,
} = require('../utils/string-utils');

const {
    updateScaffoldFile,
} = require('../utils/update-scaffold-file');

/**
 * @description Based on user input scaffold our theme
 *
 * @param {Object} answers
 * @param {string} answers.themeName
 * @param {string} answers.themeDescription
 * @param {boolean} answers.addWebpack
 * @return void
 */
const scaffoldTheme = (answers) => {
    // Absolute path of the custom folder
    const themesPath = getThemesFolderPath();

    // User inputs
    const themeName = answers.themeName.trim();
    const themeDescription = answers.themeDescription.trim();
    const addWebpack = answers.addWebpack;

    // Make folder "safe" if there are spaces
    const safeThemeName = addDashesToString(themeName);
    const capAndSnakeCaseTheme = capAndSnakeCaseString(safeThemeName);

    console.log(themeName);
    console.log(themeDescription);
    console.log(addWebpack);
    console.log(safeThemeName)

    console.log(capAndSnakeCaseTheme);

    const newThemePath = `${themesPath}/${safeThemeName}`;

    try {
        if (fs.existsSync(newThemePath)) {
            console.log(colors.red('There is already a theme with that name. Please use another name.'));

            process.exit(0);
        }

        // Copy our files over to the themes folder
        fse.copySync(`${path.join(__dirname + '../../../scaffolding/theme')}`, newThemePath, {overwrite: false});

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
                stringToUpdate: 'KEITH_THEME_VALUE',
                updateString: safeThemeName,
            }
        );

    } catch (err) {

        console.error(err);

    }

};

module.exports = scaffoldTheme;

