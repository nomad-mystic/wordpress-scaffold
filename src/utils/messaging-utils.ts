// Community Modules
import colors from 'colors';

// Package Modules
import InterfacePluginAnswerValues from '../interfaces/plugin/interface-plugin-answer-values.js';
import InterfaceThemeAnswerValues from '../interfaces/theme/interface-theme-answer-values.js';

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
     * @description Display messages to the user after all the scaffolding has been performed
     * @oublic
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {InterfacePluginAnswerValues | InterfaceThemeAnswerValues} values
     * @param {boolean} composerAlreadyExists
     * @param {boolean} packageAlreadyExists
     */
    public static displayEndingMessages = async (
        values: InterfacePluginAnswerValues | InterfaceThemeAnswerValues,
        composerAlreadyExists: boolean,
        packageAlreadyExists: boolean
    ): Promise<void> => {
        try {
            // Let the user know it has been created
            await this.displayColoredMessage(`Your ${ values.name } ${ values.type } has been scaffold! \n`, 'green');
            await this.displayColoredMessage(`Check: ${ values.finalPath } \n`, 'yellow');

            // Let the user know they need to follow-up in the CLI
            if (!composerAlreadyExists || !packageAlreadyExists) {
                await this.displayColoredMessage(`Don\'t forget to run these commands in the root of the ${ values.type }`, 'yellow');
            }

            if (!composerAlreadyExists) {
                await this.displayColoredMessage(`$ composer run-script auto-load-classes`, 'green');
            }

            if (!packageAlreadyExists) {
                await this.displayColoredMessage(`$ nvm use && npm install`, 'green');
            }

        } catch (err: any) {
            console.log('MessagingUtils.displayEndingMessages()');
            console.error(err);
        }
    };
}
