import { getInternalConfig } from '../utils/get-config.js';
import { scaffoldInternal } from '../scaffold/common/scaffold-internal.js';
const themeOptions = [
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
const getThemeOptions = async () => {
    try {
        await scaffoldInternal();
        let jsonFileParsed = await getInternalConfig('project/project-config.json');
        if (jsonFileParsed && typeof jsonFileParsed !== 'undefined' && jsonFileParsed['project-name'] === '') {
            const projectNameOption = {
                type: 'input',
                name: 'projectName',
                message: 'What is the name of your WordPress site?',
                default: 'scaffold-project',
            };
            themeOptions.unshift(projectNameOption);
        }
        if (jsonFileParsed && typeof jsonFileParsed !== 'undefined' && jsonFileParsed['site-url'] === '' || jsonFileParsed['dev-site-url'] === '') {
            const siteUrlOption = {
                type: 'input',
                name: 'siteUrl',
                message: 'What is the URL of your WordPress site?',
                default: 'https://example.com',
            };
            const devSiteUrl = {
                type: 'input',
                name: 'devSiteUrl',
                message: 'What is the development URL of your WordPress site?',
                default: 'https://example.com.test',
            };
            themeOptions.push(siteUrlOption);
            themeOptions.push(devSiteUrl);
        }
        return themeOptions;
    }
    catch (err) {
        console.error(err);
    }
};
export default getThemeOptions;
