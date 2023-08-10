import 'dotenv/config';
import inquirer from 'inquirer';
import colors from 'colors';
class InquirerCli {
    static performPromptsTasks = async (options) => {
        try {
            const inquirer = await this.getInquirer();
            const answers = await this.performPrompt(inquirer, options);
            return answers;
        }
        catch (err) {
            console.log(colors.red('ProjectInit.performAllTasks()'));
            console.error(err);
        }
    };
    static getInquirer = async () => {
        try {
            return inquirer;
        }
        catch (err) {
            console.log(colors.red('ProjectInit.getInquirer()'));
            console.error(err);
        }
    };
    static performPrompt = async (inquirer, options) => {
        try {
            return inquirer.prompt(options)
                .catch((error) => {
                if (error.isTtyError) {
                    console.error('Prompt couldn\'t be rendered in the current environment.');
                }
                else {
                    console.log(colors.red('ProjectInit.performPrompt().prompt()'));
                    console.error(error);
                }
            });
        }
        catch (err) {
            console.log(colors.red('ProjectInit.performPrompt()'));
            console.error(err);
        }
    };
}
export default InquirerCli;
