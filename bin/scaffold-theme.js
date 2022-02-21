#! /usr/bin/env node

// Community modules
require('dotenv').config();
const inquirer = require('inquirer');
const colors = require('colors');

// Package modules
const themeOptions = require('./config/theme-options');
const scaffoldTheme = require('./scaffold/theme/scaffold-theme');
const scaffoldThemeRoot = require('./scaffold/theme/scaffold-root');

const {
    whereAmI,
    isWordpressInstall,
    getThemesFolderPath,
} = require('./utils/path-utils');

const {
    addDashesToString,
    capAndSnakeCaseString,
    pascalCaseString
} = require('./utils/string-utils');

// console.log(whereAmI());
// console.log(isWordpressInstall());
// console.log(getThemesFolderPath());

// Enable debug mode?
const isDebugMode = !!process.env?.DEBUG;

// Let the user know they need to be in the root of the project and bail early
if (!isWordpressInstall() && !isDebugMode) {

    console.log(colors.yellow('Your path is not at the root of your WordPress install.'));
    console.log(colors.yellow(`You are located at ${whereAmI()}`));
    console.log(colors.yellow('Please move to the root WordPress install folder.'));

    process.exit();
}

// Starting point for scaffolding a theme
inquirer
.prompt(themeOptions)
.then((answers) => {

    console.log(answers);

    // Absolute path of the themes folder
    const themesPath = getThemesFolderPath();

    // User inputs
    const themeName = answers?.themeName.trim();
    const themeDescription = answers?.themeDescription.trim();
    const addFrontEndBuildTools = answers?.addFrontEndBuildTools;
    const frontEndFramework = answers?.frontEndFramework;

    // Make folder "safe" if there are spaces
    const safeThemeName = addDashesToString(themeName);

    // Create the finalized path for the scaffolded theme
    const newThemePath = `${themesPath}/${safeThemeName}`;

    // Create our string modification
    const capAndSnakeCaseTheme = capAndSnakeCaseString(safeThemeName);
    const pascalThemeName = pascalCaseString(safeThemeName);

    // console.log(themeName);
    // console.log(themeDescription);
    // console.log(addFrontEndBuildTools);
    // console.log(safeThemeName);
    // console.log(capAndSnakeCaseTheme);
    // console.log(pascalThemeName);

    // Build the theme
    scaffoldTheme(answers, {
        themeName,
        themesPath,
        newThemePath,
        themeDescription,
        addFrontEndBuildTools,
        frontEndFramework,
        safeThemeName,
        capAndSnakeCaseTheme,
        pascalThemeName,
    });

    scaffoldThemeRoot(answers, {
        themeName,
        themesPath,
        newThemePath,
        themeDescription,
        addFrontEndBuildTools,
        frontEndFramework,
        safeThemeName,
        capAndSnakeCaseTheme,
        pascalThemeName,
    });

    // Let the user know it has been created
    console.log(colors.green(`Your ${themeName} theme has been scaffold.`));
    console.log(colors.yellow(`Check: ${themesPath}/${safeThemeName}`));
})
.catch((error) => {
    if (error.isTtyError) {

        console.error('Prompt couldn\'t be rendered in the current environment.');

    } else {
        console.log(colors.red('Something else went wrong!'));

        console.error(error);
    }
});
