#! /usr/bin/env node

// Community modules
require('dotenv').config();
const inquirer = require('inquirer');
const colors = require('colors');

// Package modules
const themeOptions = require('../src/config/theme-options.js');

const scaffoldTheme = require('../src/scaffold/theme/scaffold-theme');
const scaffoldThemeRoot = require('../src/scaffold/theme/scaffold-root');
const updateScaffoldClasses = require('../src/scaffold/theme/scaffold-classes');
const updateScaffoldJson = require('../src/scaffold/common/update-scaffold-json');

const {
    whereAmI,
    isWordpressInstall,
    getThemesFolderPath,
} = require('../src/utils/path-utils');

const {
    addDashesToString,
    capAndSnakeCaseString,
    pascalCaseString
} = require('../src/utils/string-utils.js');

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
    const configFilePath = `${whereAmI()}/internal/project/project-config.json`;

    // Absolute path of the themes folder
    const themesPath = getThemesFolderPath();

    // User inputs
    const projectName = answers?.projectName;
    const themeName = answers?.themeName.trim();
    const themeDescription = answers?.themeDescription.trim();
    const frontEndFramework = answers?.frontEndFramework;
    const siteUrl = answers?.siteUrl;
    const devSiteUrl = answers?.devSiteUrl;

    // Make folder "safe" if there are spaces
    const safeThemeName = addDashesToString(themeName);

    // Create the finalized path for the scaffolded theme
    const newThemePath = `${themesPath}/${safeThemeName}`;

    // Create our string modification
    const capAndSnakeCaseTheme = capAndSnakeCaseString(safeThemeName);

    let configUpdates = {
        'active-theme': safeThemeName,
        'active-theme-path': newThemePath,
        'absolute-project-folder': whereAmI(),
        'absolute-themes-folder': themesPath,
        'theme-description': themeDescription,
        'front-end-framework': frontEndFramework,
        'site-url': siteUrl,
        'dev-site-url': devSiteUrl,
    };

    if (projectName && typeof projectName !== 'undefined') {
        configUpdates['project-name'] = projectName;
        configUpdates['project-namespace'] = pascalCaseString(projectName);
    }

    // // Update our config before we scaffold theme, so we can use it in our scaffold functions
    const projectConfig = updateScaffoldJson(configFilePath, configUpdates);

    // Build the theme
    scaffoldTheme(answers, {
        themeName,
        themesPath,
        newThemePath,
        themeDescription,
        frontEndFramework,
        safeThemeName,
        capAndSnakeCaseTheme,
    });

    scaffoldThemeRoot(answers, {
        themeName,
        themesPath,
        newThemePath,
        themeDescription,
        frontEndFramework,
        safeThemeName,
        capAndSnakeCaseTheme,
        projectName: projectConfig['project-name'],
        projectNamespace: projectConfig['project-namespace'],
    });

    updateScaffoldClasses(answers, {
        themeName,
        themesPath,
        newThemePath,
        themeDescription,
        frontEndFramework,
        safeThemeName,
        capAndSnakeCaseTheme,
        projectName: projectConfig['project-name'],
        projectNamespace: projectConfig['project-namespace'],
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
