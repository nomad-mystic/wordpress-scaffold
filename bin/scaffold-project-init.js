#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
// Utils
const check_depends_1 = __importDefault(require("../src/utils/check-depends"));
const rest_utils_1 = __importDefault(require("../src/utils/rest-utils"));
const debug_utils_1 = __importDefault(require("../src/utils/debug-utils"));
const { whereAmI } = require('../src/utils/path-utils');
// Bail early!!!
// Check to make sure we have PHP and WP-CLI
check_depends_1.default.dependencyInstalled('php', 'Sorry, this script requires the PHP CLI');
check_depends_1.default.dependencyInstalled('wp', 'Sorry, this script requires the WP-CLI');
/**
 * @description Starting point for scaffolding the WordPress core files and DB
 *
 * @param {InitAnswers} InitAnswers
 * @param {InitAnswers} InitAnswers.projectName
 * @param {InitAnswers} InitAnswers.databaseSetup
 * @param {InitAnswers} InitAnswers.databaseName
 * @param {InitAnswers} InitAnswers.databasePassword
 * @param {InitAnswers} InitAnswers.databaseUsername
 * @return Promise<void>
 */
inquirer
    .prompt(projectOptions)
    .then(async (answers) => {
    try {
        // Enable debug mode?
        const isDebugFullMode = await debug_utils_1.default.isDebugFullMode();
        // Change the path for download to our "WordPress" working directory
        if (isDebugFullMode) {
            // Build the core files
            shell.exec(`wp core download --path=${process.env.WORDPRESS_PATH}`);
        }
        else {
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
        let salts = await rest_utils_1.default.apiGetText('https://api.wordpress.org/secret-key/1.1/salt/');
        // Update our files
        scaffoldProject(answers, config, salts);
        // If we didn't set up the wp-config.php we can't install WordPress
        if (answers?.databaseSetup) {
            shell.exec(`wp core install --url="${answers.siteUrl}" --title="${answers.siteTitle}" --admin_user="${answers.siteAdminUser}" --admin_password="${answers.siteAdminPassword}" --admin_email="${answers.adminEmail}" --skip-email`);
        }
        // Init a git repo if we don't have one already
        if (check_depends_1.default.dependencyInstalled('git', '', false) && !fs.existsSync('.git')) {
            // We don't want to create a git repo if we are debugging
            if (!isDebugFullMode) {
                shell.exec('git init');
            }
        }
        // Let the user know it has been created
        console.log(colors.green(`Your ${config['project-name']} project has been scaffold.`));
    }
    catch (err) {
        console.error(err);
    }
})
    .catch((error) => {
    if (error.isTtyError) {
        console.error('Prompt couldn\'t be rendered in the current environment.');
    }
    else {
        console.log(colors.red('Something else went wrong!'));
        console.error(error);
    }
});
