// interfaces
import InitAnswers from '../interfaces/project/interface-init-answers.js';
import ProjectConfig from '../interfaces/project/interface-project-config.js';
import InquirerCliOptions from "../interfaces/cli/interface-options-inquirer-cli.js";

// Utils
import { getInternalConfig } from '../utils/get-config.js';

// Common
import { scaffoldInternal } from '../scaffold/common/scaffold-internal.js';

const projectOptions: Array<InquirerCliOptions> = [
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
        when(answers: InitAnswers): boolean | undefined {
            return answers.databaseSetup;
        },
        validate(value: string): true | string {

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
        when(answers: InitAnswers) {
            return answers.databaseSetup;
        },
        validate(value: string) {
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
        when(answers: InitAnswers) {
            return answers.databaseSetup;
        },
        validate(value: string) {
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
        validate(value: string) {
            if (value !== '') {
                return true;
            }

            return 'Please enter your admin user\'s password.';
        },
    },
];

/**
 * @description Gather the needed options for use in the CLI
 * @public
 * @author Keith Murphy | nomadmystics@gmail.com
 *
 * @return Promise<void>
 */
const getProjectOptions = async (): Promise<Array<any> | undefined> => {
    try {
        await scaffoldInternal();

        let jsonFileParsed: ProjectConfig = await getInternalConfig('project/project-config.json');

        // Gather the information we need if the user didn't use the init command
        if (jsonFileParsed && typeof jsonFileParsed !== 'undefined' && jsonFileParsed['project-name'] === '') {
            const projectNameOption: InquirerCliOptions = {
                type: 'input',
                name: 'projectName',
                message: 'What is the "Project Name" of your WordPress site?',
                default: 'scaffold-project',
            };

            projectOptions.unshift(projectNameOption);
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

            projectOptions.push(siteUrlOption);
            projectOptions.push(devSiteUrl);
        }

        return projectOptions;
    } catch (err) {

        console.error(err);

    }
};

export default getProjectOptions;
