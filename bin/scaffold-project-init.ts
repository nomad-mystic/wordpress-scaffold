#! /usr/bin/env node

// Community modules
import 'dotenv/config';

import inquirer from 'inquirer';
import colors from 'colors';
import shell from 'shelljs';
import fs from 'fs';

// Package modules
import getProjectOptions from '../src/config/project-options.js';
import scaffoldProject from '../src/scaffold/project/scaffold-project.js';
import updateScaffoldJson from '../src/scaffold/common/update-scaffold-json.js';

// Interfaces
import InitAnswers from '../src/interfaces/project/interface-init-answers.js';

// Utils
import CheckDepends from '../src/utils/check-depends.js';
import RestUtils from '../src/utils/rest-utils.js';
import DebugUtils from '../src/utils/debug-utils.js';
import PathUtils from '../src/utils/path-utils.js';

import InquirerCli from '../src/cli/inquirer-cli.js';
import AbstractScaffold from "../src/abstract/AbstractScaffold.js";

// Bail early!!!
// Check to make sure we have PHP and WP-CLI
CheckDepends.dependencyInstalled('php', 'Sorry, this script requires the PHP CLI');
CheckDepends.dependencyInstalled('wp', 'Sorry, this script requires the WP-CLI');

/**
 * @class ScaffoldProject
 */
class ScaffoldProject extends AbstractScaffold {
    private static isDebugFullMode: boolean = false;
    private static whereAmI: string = '';

    /**
     * @description Starting point for scaffolding the WordPress core files and DB
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<void>
     */
    public static performScaffolding = async (): Promise<void> => {
        try {
            const answers: InitAnswers | void = await InquirerCli.performPromptsTasks(await getProjectOptions()).catch((err) => console.error(err));

            // Gather our location
            this.whereAmI = await PathUtils.whereAmI();

            // Enable debug mode?
            this.isDebugFullMode = await DebugUtils.isDebugFullMode();

            // Download WP Code
            await this.downloadWPCoreCode();

            // Update and install or install files
            const config = await this.scaffoldFiles(answers);

            // Install WP DB
            await this.installWPCoreDB(answers);

            // Install .git
            await this.installGit();

            // Let the user know it has been created
            console.log(colors.green(`Your ${config['project-name']} project has been scaffold.`));

        } catch (err: any) {

            console.error(err);

        }
    };

    /**
     * @description Download WP core code using the wp-cli
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     * @link https://developer.wordpress.org/cli/commands/core/download/
     *
     * @return Promise<void>
     */
    private static downloadWPCoreCode = async (): Promise<void> => {
        // Change the path for download to our "WordPress" working directory
        if (this.isDebugFullMode) {

            // Build the core files
            shell.exec(`wp core download --path=${process.env.WORDPRESS_PATH}`);

        } else {
            // Build the core files
            shell.exec('wp core download');
        }
    };

    /**
     * @description Install WordPress core DB
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     * @link https://developer.wordpress.org/cli/commands/core/install/
     *
     * @param {InitAnswers | void} answers These are the user input options form the CLI
     * @return Promise<void>
     */
    private static installWPCoreDB = async (answers: InitAnswers): Promise<void> => {
        let installCommand: string = `wp core install --url="${answers.siteUrl}" --title="${answers.siteTitle}" --admin_user="${answers.siteAdminUser}" --admin_password="${answers.siteAdminPassword}" --admin_email="${answers.adminEmail}" --skip-email`;

        if (this.isDebugFullMode) {
            installCommand += ` --path="${process.env.WORDPRESS_PATH}"`;
        }

        // If we didn't set up the wp-config.php we can't install WordPress
        if (answers?.databaseSetup) {
            shell.exec(`wp core install ${installCommand}`);
        }
    };

    /**
     * @description Install a git repository if it doesn't exist and we not in debug mode
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<void>
     */
    private static installGit = async (): Promise<void> => {
        // Init a git repo if we don't have one already
        if (CheckDepends.dependencyInstalled('git', '', false) && !fs.existsSync('.git')) {
            // We don't want to create a git repo if we are debugging
            if (!this.isDebugFullMode) {
                shell.exec('git init');
            }
        }
    };

    /**
     * @description Perform our scaffolding
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<void>
     */
    protected static scaffoldFiles = async (answers: InitAnswers | any): Promise<string | any> => {
        try {
            const filePath: string = `${this.whereAmI}/internal/project/project-config.json`;

            await updateScaffoldJson(filePath, answers);

            // Manually update these properties
            const config = await updateScaffoldJson(filePath, {
                'absolute-project-folder': this.whereAmI,
            });

            // Hit the WordPress API for our site's salts
            let salts: string | void | undefined = await RestUtils.apiGetText('https://api.wordpress.org/secret-key/1.1/salt/');

            // Update our files
            await scaffoldProject(answers, config, salts);

            return config;

        } catch (err) {

            console.error(err);

        }
    }
}

ScaffoldProject.performScaffolding().catch(err => console.error(err));
