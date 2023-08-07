#! /usr/bin/env node

// Community modules
require('dotenv').config();
const inquirer = require('inquirer');
const colors = require('colors');
const shell = require('shelljs');
const fs = require('fs');

// Package modules
const projectOptions = require('../src/config/project-options');
const scaffoldProject = require('../src/scaffold/project/scaffold-project');
const updateScaffoldJson = require('../src/scaffold/common/update-scaffold-json');

// Interfaces
import InitAnswers from '../src/interfaces/project/interface-init-answers';

// Utils
import CheckDepends from '../src/utils/check-depends';
import RestUtils from '../src/utils/rest-utils';

const { whereAmI } = require('../src/utils/path-utils');

// Bail early!!!
// Check to make sure we have PHP and WP-CLI
CheckDepends.dependencyInstalled('php', 'Sorry, this script requires the PHP CLI');
CheckDepends.dependencyInstalled('wp', 'Sorry, this script requires the WP-CLI');

/**
 * @description Starting point for scaffolding the WordPress core files and DB
 *
 * @param {InitAnswers} InitAnswers
 * @param {InitAnswers} InitAnswers.projectName
 * @param {InitAnswers} InitAnswers.databaseSetup
 * @param {InitAnswers} InitAnswers.databaseName
 * @param {InitAnswers} InitAnswers.databasePassword
 * @param {InitAnswers} InitAnswers.databaseUsername
 * @return void
 */
inquirer
.prompt(projectOptions)
.then(async (answers: InitAnswers) => {
    try {
        // Enable debug mode?
        const isDebugMode: boolean = !!process.env?.DEBUG;
        const wordPressDebugPath: boolean = !!process.env?.WORDPRESS_PATH;

        // Change the path for download to our "WordPress" working directory
        if (isDebugMode && wordPressDebugPath) {

            // Build the core files
            shell.exec(`wp core download --path=${process.env.WORDPRESS_PATH}`);

        } else {
            // Build the core files
            shell.exec('wp core download');
        }

        const filePath: string = `${whereAmI()}/internal/project/project-config.json`;

        const config = updateScaffoldJson(filePath, answers);

        // Manually update these properties
        updateScaffoldJson(filePath, {
            'absolute-project-folder': whereAmI(),
        });

        // Hit the WordPress API for our site's salts
        let salts: string | void = await RestUtils.apiGetText('https://api.wordpress.org/secret-key/1.1/salt/');

        // Update our files
        scaffoldProject(answers, config, salts);

        // If we didn't set up the wp-config.php we can't install WordPress
        if (answers?.databaseSetup) {
            shell.exec(`wp core install --url="${answers.siteUrl}" --title="${answers.siteTitle}" --admin_user="${answers.siteAdminUser}" --admin_password="${answers.siteAdminPassword}" --admin_email="${answers.adminEmail}" --skip-email`);
        }

        // Init a git repo if we don't have one already
        if (CheckDepends.dependencyInstalled('git', '', false) && !fs.existsSync('.git')) {
            // We don't want to create a git repo if we are debugging
            if (!isDebugMode && !wordPressDebugPath) {
                shell.exec('git init');
            }
        }

        // Let the user know it has been created
        console.log(colors.green(`Your ${config['project-name']} project has been scaffold.`));

    } catch (err) {

        console.error(err);

    }
})
.catch((error: any) => {
    if (error.isTtyError) {

        console.error('Prompt couldn\'t be rendered in the current environment.');

    } else {
        console.log(colors.red('Something else went wrong!'));

        console.error(error);
    }
});
