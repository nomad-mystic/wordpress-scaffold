// Interfaces
import InquirerCliOptions from '../interfaces/cli/interface-options-inquirer-cli.js';
import ProjectConfig from '../interfaces/project/interface-project-config.js';

// Functions
import { getInternalConfig } from '../utils/get-config.js';
import { scaffoldInternal } from '../scaffold/common/scaffold-internal.js';
import getCommonOptions from './common-options.js';

/**
 * @description Interactive CLI options for building the plugin
 *
 * @type {[{default: string, name: string, type: string, message: string},{default: string, name: string, type: string, message: string},{default: string, name: string, type: string, message: string, choices: string[]}]}
 */
let pluginOptions: Array<InquirerCliOptions> = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of your plugin?',
        default: 'scaffold-plugin',
    },
    {
        type: 'input',
        name: 'description',
        message: 'What would like the description of the plugin to be?',
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
const getPluginOptions = async (): Promise<Array<any> | undefined> => {
    try {
        await scaffoldInternal();

        let jsonFileParsed: ProjectConfig = await getInternalConfig('project/project-config.json');

        // Check if we need common options
        const commonOptions: InquirerCliOptions = await getCommonOptions(jsonFileParsed);

        // "Merge" our arrays
        pluginOptions = pluginOptions.concat(commonOptions);

        return pluginOptions;

    } catch (err) {
        console.log('getPluginOptions()');
        console.error(err);
    }
};

export default getPluginOptions;
