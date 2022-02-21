/**
 * @description Interactive CLI options for building the theme
 *
 * @type {[{default: string, name: string, type: string, message: string},{default: string, name: string, type: string, message: string},{default: boolean, name: string, type: string, message: string},{default: string, name: string, type: string, message: string, choices: string[], when(*): boolean|*}]}
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
        type: 'confirm',
        name: 'addFrontEndBuildTools',
        message: 'Would you like to scaffold a front-end build system?',
        default: true,
    },
    {
        type: 'list',
        name: 'frontEndFramework',
        message: 'What front-end framework would you like to add?',
        choices: ['None', 'Vue', 'React'],
        when(answers) {
            return answers.addFrontEndBuildTools;
        },
        default: 'None',
    },
];


module.exports = themeOptions;

