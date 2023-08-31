// Community Modules
import colors from 'colors';

// Package Modules
import PluginAnswerValues from '../interfaces/plugin/interface-plugin-answer-values.js';
import ThemeAnswerValues from '../interfaces/theme/interface-theme-answer-values.js';

/**
 * @classdesc
 * @class MessagingUtils
 * @author Keith Murphy | nomadmystics@gmail.com
 */
export default class MessagingUtils {
    /**
     * @description Display messages to the console based on message and color values
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<void>
     */
    public static displayColoredMessage = async (message: string, color: string = 'green'): Promise<void> => {
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

    /**
     * @description
     * @oublic
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {PluginAnswerValues | ThemeAnswerValues} values
     * @param {boolean} composerAlreadyExists
     * @param {boolean} packageAlreadyExists
     */
    public static displayEndingMessages = async (
        values: PluginAnswerValues | ThemeAnswerValues,
        composerAlreadyExists: boolean,
        packageAlreadyExists: boolean
    ): Promise<void> => {
        try {
            // Let the user know it has been created
            await MessagingUtils.displayColoredMessage(`Your ${values.name} ${values.type} has been scaffold! \n`, 'green');
            await MessagingUtils.displayColoredMessage(`Check: ${values.finalPath} \n`, 'yellow');

            // Let the user know they need to follow-up in the CLI
            if (!composerAlreadyExists || !packageAlreadyExists) {
                await MessagingUtils.displayColoredMessage(`Don\'t forget to run these commands in the root of the ${values.type}`, 'yellow');
            }

            if (!composerAlreadyExists) {
                await MessagingUtils.displayColoredMessage(`$ composer run-script auto-load-classes`, 'green');
            }

            if (!packageAlreadyExists) {
                await MessagingUtils.displayColoredMessage(`$ nvm use && npm install`, 'green');
            }

        } catch (err: any) {
            console.log('MessagingUtils.displayEndingMessages()');
            console.error(err);
        }
    };
}
