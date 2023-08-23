import colors from "colors";

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
}
