// Community modules
require('dotenv').config();

/**
 * @class DebugUtils
 */
export default class DebugUtils {
    /**
     * @description Check if local DEBUG and WORDPRESS_PATH .env variables are set
     * @public
     *
     * @return Promise<boolean>
     */
    public static isDebugFullMode = async (): Promise<boolean> => {
        // Enable debug mode?
        const isDebugMode: boolean = await this.isDebugMode();
        const wordPressDebugPath: boolean = await this.isDebugWordPressPath();

        return isDebugMode && wordPressDebugPath;
    };

    /**
     * @description Check if local DEBUG .env variable is set
     * @public
     *
     * @return Promise<boolean>
     */
    public static isDebugMode = async (): Promise<boolean> => {
        // Enable debug mode?
        const isDebugMode: boolean = !!process.env?.DEBUG;

        return isDebugMode;
    };

    /**
     * @description Check if local WORDPRESS_PATH .env variable is set
     * @public
     *
     * @return Promise<boolean>
     */
    public static isDebugWordPressPath = async (): Promise<boolean> => {
        // Enable WordPress path?
        const wordPressDebugPath: boolean = !!process.env?.WORDPRESS_PATH;

        return wordPressDebugPath;
    };
}
