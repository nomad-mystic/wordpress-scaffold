"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Community modules
require('dotenv').config();
/**
 * @class DebugUtils
 */
class DebugUtils {
    /**
     * @description Check if local DEBUG and WORDPRESS_PATH .env variables are set
     * @public
     *
     * @return Promise<boolean>
     */
    static isDebugFullMode = async () => {
        // Enable debug mode?
        const isDebugMode = await this.isDebugMode();
        const wordPressDebugPath = await this.isDebugWordPressPath();
        return isDebugMode && wordPressDebugPath;
    };
    /**
     * @description Check if local DEBUG .env variable is set
     * @public
     *
     * @return Promise<boolean>
     */
    static isDebugMode = async () => {
        // Enable debug mode?
        const isDebugMode = !!process.env?.DEBUG;
        return isDebugMode;
    };
    /**
     * @description Check if local WORDPRESS_PATH .env variable is set
     * @public
     *
     * @return Promise<boolean>
     */
    static isDebugWordPressPath = async () => {
        // Enable WordPress path?
        const wordPressDebugPath = !!process.env?.WORDPRESS_PATH;
        return wordPressDebugPath;
    };
}
exports.default = DebugUtils;
