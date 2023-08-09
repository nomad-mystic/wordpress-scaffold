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
import ThemeAnswers from '../interfaces/theme/interface-theme-answers.js';

// Utils
import CheckDepends from '../utils/check-depends.js';

import RestUtils from '../utils/rest-utils.js';
import DebugUtils from '../utils/debug-utils.js';
import PathUtils from '../utils/path-utils.js';
import InquirerCliOptions from "../interfaces/cli/interface-options-inquirer-cli.js";


/**
 * @class ProjectInit
 */
class InquirerCli {
    /**
     * @description Starting point for building in the initial WordPress site
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {Array<any> | undefined} options
     * @return {Promise<InitAnswers | ThemeAnswers | void>}
     */
    public static performPromptsTasks = async (options: Array<any> | undefined): Promise<InitAnswers | ThemeAnswers | void> => {
        try {
            const inquirer = await this.getInquirer();

            const answers: InitAnswers | ThemeAnswers | void = await this.performPrompt(inquirer, options);

            return answers;

        } catch (err) {

            console.log(colors.red('ProjectInit.performAllTasks()'));
            console.error(err);

        }
    };

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
     * @param {any} inquirer
     * @param {Promise<Array<any> | undefined>} options
     * @return {Promise<InitAnswers | ThemeAnswers | void>}
     */
    private static performPrompt = async (inquirer: any, options: Array<any> | undefined): Promise<InitAnswers | ThemeAnswers | void> => {
        try {
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
}

export default InquirerCli;
