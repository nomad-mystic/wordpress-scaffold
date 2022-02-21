#! /usr/bin/env node

// Community modules
require('dotenv').config();
const inquirer = require('inquirer');
const colors = require('colors');

// Package modules
const projectInit = require('./config/theme-options');

// console.log(whereAmI());
// console.log(isWordpressInstall());
// console.log(getThemesFolderPath());

// Starting point for scaffolding a theme
inquirer
.prompt(projectInit)
.then((answers) => {

    // Check to make sure we have PHP, WP-CLI


    console.log(answers);

    // Let the user know it has been created
    // console.log(colors.green(`Your ${themeName} theme has been scaffold.`));
    // console.log(colors.yellow(`Check: ${themesPath}/${safeThemeName}`));
})
.catch((error) => {
    if (error.isTtyError) {

        console.error('Prompt couldn\'t be rendered in the current environment.');

    } else {
        console.log(colors.red('Something else went wrong!'));

        console.error(error);
    }
});
