// Community modules
import 'dotenv/config';

import inquirer from 'inquirer';
import colors from 'colors';
import shell from 'shelljs';
import fs from 'fs';

// Package modules
import getProjectOptions from '../config/project-options.js';
import scaffoldProject from '../scaffold/project/scaffold-project.js';
import updateScaffoldJson from '../scaffold/common/update-scaffold-json.js';

// Interfaces
import InitAnswers from '../interfaces/project/interface-init-answers.js';

// Utils
import CheckDepends from '../utils/check-depends.js';

import RestUtils from '../utils/rest-utils.js';
import DebugUtils from '../utils/debug-utils.js';
import PathUtils from '../utils/path-utils.js';


/**
 * @class ProjectInit
 */
class ProjectInit {
    /**
     * @description Starting point for building in the initial WordPress site
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<void>
     */
    public static performAllTasks = async (): Promise<void> => {
        try {
            const inquirer = await this.getInquirer();

            const prompt: InitAnswers | void = await this.performPrompt(inquirer);

            // await this.performScaffolding(prompt);

        } catch (err) {

            console.log(colors.red('ProjectInit.performAllTasks()'));
            console.error(err);

        }
    }

    /**
     * @description Get our inquirer object
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<any>
     */
    private static getInquirer = async (): Promise<any> => {
        try {

            return inquirer;

        } catch (err: any) {

            console.log(colors.red('ProjectInit.getInquirer()'));
            console.error(err);
        }
    }

    /**
     * @description Display and gather our prompts from the user
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<InitAnswers | void>
     */
    private static performPrompt = async (inquirer: any): Promise<InitAnswers | void> => {
        try {
            const options = await getProjectOptions();

            return inquirer.prompt(options)
                .catch((error: any): void => {
                    if (error.isTtyError) {

                        console.error('Prompt couldn\'t be rendered in the current environment.');

                    } else {

                        console.log(colors.red('ProjectInit.performPrompt().prompt()'));
                        console.error(error);

                    }
                });

        } catch (err: any) {

            console.log(colors.red('ProjectInit.performPrompt()'));
            console.error(err);

        }
    };

    /**
     * @description Starting point for scaffolding the WordPress core files and DB
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {InitAnswers} answers.projectName
     * @param {InitAnswers} answers.databaseSetup
     * @param {InitAnswers} answers.databaseName
     * @param {InitAnswers} answers.databasePassword
     * @param {InitAnswers} answers.databaseUsername
     * @return Promise<void>
     */
    private static performScaffolding = async (answers: InitAnswers | void): Promise<void> => {
        try {

            console.log(answers);


            // // Gather our location
            // const whereAmI = await PathUtils.whereAmI();
            //
            // // Enable debug mode?
            // const isDebugFullMode: boolean = await DebugUtils.isDebugFullMode();
            //
            // // Change the path for download to our "WordPress" working directory
            // if (isDebugFullMode) {
            //
            //     // Build the core files
            //     shell.exec(`wp core download --path=${process.env.WORDPRESS_PATH}`);
            //
            // } else {
            //     // Build the core files
            //     shell.exec('wp core download');
            // }
            //
            // const filePath: string = `${whereAmI}/internal/project/project-config.json`;
            //
            // const config = updateScaffoldJson(filePath, answers);
            //
            // // Manually update these properties
            // updateScaffoldJson(filePath, {
            //     'absolute-project-folder': whereAmI,
            // });
            //
            // // Hit the WordPress API for our site's salts
            // let salts: string | void = await RestUtils.apiGetText('https://api.wordpress.org/secret-key/1.1/salt/');
            //
            // // Update our files
            // scaffoldProject(answers, config, salts);
            //
            // // If we didn't set up the wp-config.php we can't install WordPress
            // if (answers?.databaseSetup) {
            //     shell.exec(`wp core install --url="${answers.siteUrl}" --title="${answers.siteTitle}" --admin_user="${answers.siteAdminUser}" --admin_password="${answers.siteAdminPassword}" --admin_email="${answers.adminEmail}" --skip-email`);
            // }
            //
            // // Init a git repo if we don't have one already
            // if (CheckDepends.dependencyInstalled('git', '', false) && !fs.existsSync('.git')) {
            //     // We don't want to create a git repo if we are debugging
            //     if (!isDebugFullMode) {
            //         shell.exec('git init');
            //     }
            // }
            //
            // // Let the user know it has been created
            // console.log(colors.green(`Your ${config['project-name']} project has been scaffold.`));

        } catch (err: any) {

            console.error(err);

        }
    };
}
