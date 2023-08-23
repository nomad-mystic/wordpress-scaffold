import colors from "colors";
import PluginAnswerValues from "../interfaces/plugin/interface-plugin-answer-values.js";
import InitAnswers from "../interfaces/project/interface-init-answers.js";
import ThemeAnswerValues from "../interfaces/theme/interface-theme-answer-values.js";

export default class MessagingUtils {
    /**
     * @description Display messages to the console based on message and color values
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<void>
     */
    public static displayColoredMessage = async (message: string, color: string): Promise<void> => {
        try {

            // Build the object methods we need to display our messages
            const displayFunctions = {
                green: (): string => {
                    return colors.green(message);
                },
                red: (): string => {
                    return colors.red(message);
                },
                yellow: (): string => {
                    return colors.yellow(message);
                },
            };

            // @ts-ignore
            console.log(displayFunctions[color]());

        } catch (err: any) {
            console.log('MessagingUtils.displayColoredMessage()');
            console.error(err);
        }
    };


    public static displayEndingMessages = async (values: PluginAnswerValues | ThemeAnswerValues | InitAnswers): Promise<void> => {
        try {
            // Let the user know it has been created
            // await MessagingUtils.displayColoredMessage(`Your ${values.name} plugin has been scaffold! \n`, 'green');
            // await MessagingUtils.displayColoredMessage(`Check: ${values.finalPath} \n`, 'yellow');
            await MessagingUtils.displayColoredMessage(`Don\'t forget to run these commands in the root of the plugin`, 'yellow');
            await MessagingUtils.displayColoredMessage(`$ composer run-script auto-load-classes`, 'green');
            await MessagingUtils.displayColoredMessage(`$ nvm use && npm install`, 'green');

        } catch (err: any) {
            console.log('displayEndingMessages()');
            console.error(err);
        }
    };
}
