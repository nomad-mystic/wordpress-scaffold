// Interfaces
import ProjectConfig from '../interfaces/project/interface-project-config.js';
import InterfaceInquirerCliOptions from '../interfaces/cli/interface-options-inquirer-cli.js';

/**
 * @description
 * @public
 * @author Keith Murphy | nomadmystics@gmail.com
 *
 * @return {Promise<void>}
 */
const getCommonOptions = async (jsonFileParsed: ProjectConfig): Promise<Array<InterfaceInquirerCliOptions> | any> => {
    try {
        let commonOptions: Array<InterfaceInquirerCliOptions> = [];

        // @todo Refactor this into a Promise which can be used by theme as well
        // Gather the information we need if the user didn't use the init command
        if (jsonFileParsed && typeof jsonFileParsed !== 'undefined') {

            if (jsonFileParsed['project-name'] === '') {
                const projectNameOption: InterfaceInquirerCliOptions = {
                    type: 'input',
                    name: 'projectName',
                    message: 'What is the name of your WordPress site?',
                    default: 'scaffold-project',
                };

                commonOptions.unshift(projectNameOption);
            }

            if (jsonFileParsed['site-url'] === '') {
                const siteUrlOption: InterfaceInquirerCliOptions = {
                    type: 'input',
                    name: 'siteUrl',
                    message: 'What is the URL of your WordPress site?',
                    default: 'https://example.com',
                };

                commonOptions.push(siteUrlOption);
            }

            if (jsonFileParsed['dev-site-url'] === '') {
                const devSiteUrl: InterfaceInquirerCliOptions = {
                    type: 'input',
                    name: 'devSiteUrl',
                    message: 'What is the development URL of your WordPress site?',
                    default: 'https://example.com.test',
                };

                commonOptions.push(devSiteUrl);
            }
        }

        return commonOptions;

    } catch (err: any) {
        console.log('getCommonOptions()');
        console.log(err);
    }
};

export default getCommonOptions;
