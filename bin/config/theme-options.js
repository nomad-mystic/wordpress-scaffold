const themeOptions = [
    {
        type: 'input',
        name: 'themeName',
        message: 'What is the name of your theme?',
        default: 'scaffold-theme',
    },
    // {
    //     type: 'input',
    //     name: 'moduleAdminName',
    //     message: 'What is the admin name of your module?',
    //     default: 'Scaffold Module',
    // },
    {
        type: 'input',
        name: 'themeDescription',
        message: 'What would like the description of the theme be?',
        default: '',
    },
    {
        type: 'confirm',
        name: 'addWebpack',
        message: 'Would you like to scaffold a Webpack build system?',
        default: true,
    },
];


module.exports = themeOptions;

