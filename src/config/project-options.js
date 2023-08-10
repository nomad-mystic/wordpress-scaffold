import { getInternalConfig } from '../utils/get-config.js';
import { scaffoldInternal } from '../scaffold/common/scaffold-internal.js';
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
    {
        type: 'input',
        name: 'siteTitle',
        message: 'What is the title for the site?',
        default: 'Example Site',
    },
    {
        type: 'input',
        name: 'siteAdminUser',
        message: 'What is the admin username for the site?',
        default: 'example@example.com',
    },
    {
        type: 'input',
        name: 'adminEmail',
        message: 'What is the admin email for the site?',
        default: 'example@example.com',
    },
    {
        type: 'password',
        name: 'siteAdminPassword',
        message: 'What is the admin user\'s password for the site?',
        default: '',
        validate(value) {
            if (value !== '') {
                return true;
            }
            return 'Please enter your admin user\'s password.';
        },
    },
];
const getProjectOptions = async () => {
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
        return projectOptions;
    }
    catch (err) {
        console.error(err);
    }
};
export default getProjectOptions;
