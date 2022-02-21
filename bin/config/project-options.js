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
    },
    {
        type: 'password',
        name: 'databasePassword',
        message: 'What is the DB password for the site?',
        default: '',
        when(answers) {
            return answers.databaseSetup;
        },
    },
    {
        type: 'input',
        name: 'databaseUser',
        message: 'What is the DB user for the site?',
        default: '',
        when(answers) {
            return answers.databaseSetup;
        },
    },
];

module.exports = projectOptions;
