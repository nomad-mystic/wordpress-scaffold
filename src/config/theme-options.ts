// Interfaces
import InquirerCliOptions from '../interfaces/cli/interface-options-inquirer-cli.js';
import ProjectConfig from '../interfaces/project/interface-project-config.js';

import { getInternalConfig } from '../utils/get-config.js';
import { scaffoldInternal } from '../scaffold/common/scaffold-internal.js';

/**
 * @description Interactive CLI options for building the theme
 *
 * @type {[{default: string, name: string, type: string, message: string},{default: string, name: string, type: string, message: string},{default: string, name: string, type: string, message: string, choices: string[]}]}
 */
const themeOptions: Array<InquirerCliOptions> = [
    {
        type: 'input',
        name: 'themeName',
        message: 'What is the name of your theme?',
        default: 'scaffold-theme',
    },
    {
        type: 'input',
        name: 'themeDescription',
        message: 'What would like the description of the theme be?',
        default: '',
    },
    {
        type: 'list',
        name: 'frontEndFramework',
        message: 'What front-end framework would you like to add?',
        choices: ['None', 'Vue'],
        default: 'None',
    },
];

/**
 * @description Gather the needed options for use in the CLI
 * @public
 * @author Keith Murphy | nomadmystics@gmail.com
 *
 * @return Promise<void>
 */
const getThemeOptions = async (): Promise<Array<any> | undefined> => {
    try {
        await scaffoldInternal();

        let jsonFileParsed: ProjectConfig = await getInternalConfig('project/project-config.json');

        // Gather the information we need if the user didn't use the init command
        if (jsonFileParsed && typeof jsonFileParsed !== 'undefined' && jsonFileParsed['project-name'] === '') {
            const projectNameOption: InquirerCliOptions = {
                type: 'input',
                name: 'projectName',
                message: 'What is the name of your WordPress site?',
                default: 'scaffold-project',
            };

            themeOptions.unshift(projectNameOption);
        }

        if (jsonFileParsed && typeof jsonFileParsed !== 'undefined' && jsonFileParsed['site-url'] === '' || jsonFileParsed['dev-site-url'] === '') {
            const siteUrlOption: InquirerCliOptions = {
                type: 'input',
                name: 'siteUrl',
                message: 'What is the URL of your WordPress site?',
                default: 'https://example.com',
            };

            const devSiteUrl: InquirerCliOptions = {
                type: 'input',
                name: 'devSiteUrl',
                message: 'What is the development URL of your WordPress site?',
                default: 'https://example.com.test',
            };

            themeOptions.push(siteUrlOption);
            themeOptions.push(devSiteUrl);
        }

        return themeOptions;

    } catch (err) {

        console.error(err);

    }
}

export default getThemeOptions;
