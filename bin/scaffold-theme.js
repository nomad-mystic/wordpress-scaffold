#! /usr/bin/env node

const inquirer = require('inquirer');

// Package modules
const themeOptions = require('./config/theme-options');
const scaffoldTheme = require('./scaffold/scaffold-theme');

// Starting point for scaffolding a theme
inquirer
    .prompt(themeOptions)
    .then((answers) => {
        // Absolute path of the custom folder
        // const customPath = getModulesFolderPath();

        // Build the module
        scaffoldTheme(answers);

        // Let the user know it has been created
        // console.log("\n");
        // console.log(colors.green(`Your ${answers.machineName} module has been scaffold.`));
        // console.log(colors.yellow(`Check: ${customPath}/${answers.machineName}`));
    })
    .catch((error) => {
        if (error.isTtyError) {

            console.error('Prompt couldn\'t be rendered in the current environment.');

        } else {
            console.log(colors.red('Something else went wrong!'));

            console.error(error);
        }
    });
