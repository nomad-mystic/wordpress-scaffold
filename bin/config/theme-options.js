const {
    getInternalConfig,
} = require('../utils/get-config');

require('../scaffold/common/scaffold-internal').scaffoldInternal();

/**
 * @description Interactive CLI options for building the theme
 *
 * @type {[{default: string, name: string, type: string, message: string},{default: string, name: string, type: string, message: string},{default: string, name: string, type: string, message: string, choices: string[]}]}
 */
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
        choices: ['None', 'Vue', 'React'],
        default: 'None',
    },
];

let jsonFileParsed = getInternalConfig('project/project-config.json');

// Gather the information we need if the user didn't use the init command
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

module.exports = themeOptions;
