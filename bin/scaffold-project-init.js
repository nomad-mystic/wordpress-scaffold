#! /usr/bin/env node

// Community modules
require('dotenv').config();
const inquirer = require('inquirer');
const colors = require('colors');
const shell = require('shelljs');
const fs = require('fs');

// Package modules
const projectOptions = require('./config/project-options');
const scaffoldProject = require('./scaffold/project/scaffold-project');
const updateScaffoldJson = require('./scaffold/common/update-scaffold-json');

const {
    apiGetText,
} = require('./utils/rest-utils');

const {
    whereAmI, isWordpressInstall,
} = require('./utils/path-utils');

const {
    camelCaseToDash,
} = require('./utils/string-utils');

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

/**
 * @description Starting point for scaffolding the WordPress core files and DB
 *
 * @param {Object} answers
 * @param {object} answers.projectName
 * @param {object} answers.databaseSetup
 * @param {object|null} answers.databaseName
 * @param {object|null} answers.databasePassword
 * @param {object|null} answers.databaseUsername
 * @param salts
 * @return void
 */
inquirer
.prompt(projectOptions)
.then(async (answers) => {
    // Enable debug mode?
    const isDebugMode = !!process.env?.DEBUG;
    const wordPressDebugPath = !!process.env?.WORDPRESS_PATH;

    // Change the path for download to our "WordPress" working directory
    if (isDebugMode && wordPressDebugPath) {

        // Build the core files
        shell.exec(`wp core download --path=${process.env.WORDPRESS_PATH}`);

    } else {
        // Build the core files
        shell.exec('wp core download');
    }


    const filePath = `${whereAmI()}/internal/project/project-config.json`;

    const config = updateScaffoldJson(filePath, answers);

    // Manually update these properties
    updateScaffoldJson(filePath, {
        'absolute-project-folder': whereAmI(),
    });

    // Hit the WordPress API for our site's salts
    let salts = await apiGetText('https://api.wordpress.org/secret-key/1.1/salt/');

    // Update our files
    scaffoldProject(answers, config, salts);

    // If we didn't set up the wp-config.php we can't install WordPress
    if (answers.databaseSetup) {
        shell.exec(`wp core install --url="${answers.siteUrl}" --title="${answers.siteTitle}" --admin_user="${answers.siteAdminUser}" --admin_password="${answers.siteAdminPassword}" --admin_email="${answers.adminEmail}" --skip-email`);
    }

    // Init a git repo if we don't have one already
    if (shell.which('git') && !fs.existsSync('.git')) {
        // We don't want to create a git repo if we are debugging
        if (!isDebugMode && !wordPressDebugPath) {
            shell.exec('git init');
        }
    }

    // Let the user know it has been created
    console.log(colors.green(`Your ${config['project-name']} project has been scaffold.`));
})
.catch((error) => {
    if (error.isTtyError) {

        console.error('Prompt couldn\'t be rendered in the current environment.');

    } else {
        console.log(colors.red('Something else went wrong!'));

        console.error(error);
    }
});
