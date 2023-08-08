// Community modules
import 'dotenv/config';
import inquirer from 'inquirer';
import colors from 'colors';
/**
 * @class ProjectInit
 */
class InquirerCli {
    /**
     * @description Starting point for building in the initial WordPress site
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<void>
     */
    static performPromptsTasks = async (options) => {
        try {
            console.log(options);
            const inquirer = await this.getInquirer();
            const answers = await this.performPrompt(inquirer, options);
            return answers;
        }
        catch (err) {
            console.log(colors.red('ProjectInit.performAllTasks()'));
            console.error(err);
        }
    };
    /**
     * @description Get our inquirer object
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<any>
     */
    static getInquirer = async () => {
        try {
            return inquirer;
        }
        catch (err) {
            console.log(colors.red('ProjectInit.getInquirer()'));
            console.error(err);
        }
    };
    /**
     * @description Display and gather our prompts from the user
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {any} inquirer
     * @param {Promise<Array<any> | undefined>} options
     * @return Promise<InitAnswers | void>
     */
    static performPrompt = async (inquirer, options) => {
        try {
            // const options = await getProjectOptions();
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
