#! /usr/bin/env node

// Community modules
require('dotenv').config();
const inquirer = require('inquirer');
const colors = require('colors');
const shell = require('shelljs');


// Package modules
const projectOptions = require('./config/project-options');
const scaffoldProject = require('./scaffold/project/scaffold-project');
const {apiGetText} = require("./utils/rest-utils");

// console.log(whereAmI());
// console.log(isWordpressInstall());
// console.log(getThemesFolderPath());

// Bail early!!!
// Check to make sure we have PHP and WP-CLI
if (!shell.which('php')) {
    shell.echo('Sorry, this script requires the PHP CLI');

    shell.exit(1);
}

if (!shell.which('wp')) {
    shell.echo('Sorry, this script requires the WP-CLI');

    shell.exit(1);
}

// Starting point for scaffolding a theme
inquirer
.prompt(projectOptions)
.then(async (answers) => {
    // console.log(answers);

    // Hit the WordPress API for our site's salts
    let salts = await apiGetText('https://api.wordpress.org/secret-key/1.1/salt/');

    scaffoldProject(answers, salts);

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
