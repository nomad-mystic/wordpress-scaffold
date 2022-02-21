const projectOptions = [
    {
        type: 'input',
        name: 'projectName',
        message: 'What is the name of your WordPress site?',
        default: 'scaffold-theme',
    },
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
        name: 'siteUrl',
        message: 'What is the URL of your WordPress site?',
        default: 'https://example.com',
    },
    {
        type: 'input',
        name: 'devSiteUrl',
        message: 'What is the development URL of your WordPress site?',
        default: 'https://example.com.test',
    },
];

module.exports = projectOptions;
