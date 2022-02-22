const {
    getInternalConfig,
} = require('../utils/get-config');

require('../utils/scaffold-internal').scaffoldInternal();

/**
 *
 * @type {[{default: boolean, name: string, type: string, message: string},{default: string, name: string, type: string, message: string, when(*): Object|*, validate(*): (boolean|string)},{default: string, name: string, type: string, message: string, when(*): Object|*, validate(*): (boolean|string)},{default: string, name: string, type: string, message: string, when(*): Object|*, validate(*): (boolean|string)}]}
 */
const projectOptions = [
    {
        type: 'confirm',
        name: 'databaseSetup',
        message: 'Have you setup your database and user for this site?',
        default: false,
    },
    {
        type: 'input',
        name: 'databaseName',
        message: 'What is the DB name for the site?',
        default: '',
        when(answers) {
            return answers.databaseSetup;
        },
        validate(value) {

            if (value !== '') {
                return true;
            }

            return 'Please enter a database name.';
        },
    },
    {
        type: 'password',
        name: 'databasePassword',
        message: 'What is the DB password for the site?',
        default: '',
        when(answers) {
            return answers.databaseSetup;
        },
        validate(value) {
            if (value !== '') {
                return true;
            }

            return 'Please enter a database password.';
        },
    },
    {
        type: 'input',
        name: 'databaseUsername',
        message: 'What is the DB username for the site?',
        default: '',
        when(answers) {
            return answers.databaseSetup;
        },
        validate(value) {
            if (value !== '') {
                return true;
            }

            return 'Please enter a database username.';
        },
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

    projectOptions.unshift(projectNameOption);
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

    projectOptions.push(siteUrlOption);
    projectOptions.push(devSiteUrl);
}

module.exports = projectOptions;
