// Interfaces
import InquirerCliOptions from '../interfaces/cli/interface-options-inquirer-cli.js';
import ProjectConfig from '../interfaces/project/interface-project-config.js';

import { getInternalConfig } from '../utils/get-config.js';
import { scaffoldInternal } from '../scaffold/common/scaffold-internal.js';
import getCommonOptions from './common-options.js';

/**
 * @description Interactive CLI options for building the theme
 *
 * @type {[{default: string, name: string, type: string, message: string},{default: string, name: string, type: string, message: string},{default: string, name: string, type: string, message: string, choices: string[]}]}
 */
let themeOptions: Array<InquirerCliOptions> = [
    {
        type: 'input',
        name: 'themeName',
        message: 'What is the name of your theme?',
        default: 'scaffold-theme',
    },
    {
        type: 'input',
        name: 'description',
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

        // Check if we need common options
        const commonOptions: InquirerCliOptions = await getCommonOptions(jsonFileParsed);

        // "Merge" our arrays
        themeOptions = themeOptions.concat(commonOptions)

        return themeOptions;

    } catch (err) {
        console.log('getThemeOptions()');
        console.error(err);
    }
}

export default getThemeOptions;
