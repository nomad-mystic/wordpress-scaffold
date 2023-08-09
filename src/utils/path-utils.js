import 'dotenv/config';
// Core Modules
import path from 'path';
// Community Modules
import fs from 'fs-extra';
// import { random } from 'lodash';
// Package modules
import DebugUtils from './debug-utils.js';
export default class PathUtils {
    /**
     * @description Gets the current path
     * @public
     *
     * @return {Promise<string>}
     */
    static whereAmI = async () => {
        const isDebugFullMode = await DebugUtils.isDebugFullMode();
        // Enabled debug mode?
        if (isDebugFullMode) {
            const wordPressDebugPath = process.env?.WORDPRESS_PATH ?? '';
            return path.resolve(wordPressDebugPath);
        }
        else {
            return path.resolve(process.cwd());
        }
    };
    /**
     * @description Check if the users is the root of the project or another folder
     * @public
     * @todo maybe use `wp core is-installed`, see https://developer.wordpress.org/cli/commands/core/is-installed/
     *
     * @return {Promise<boolean | undefined>}
     */
    static isWordpressInstall = async () => {
        try {
            return fs.pathExistsSync(`${await this.whereAmI()}/wp-admin/admin-ajax.php`);
        }
        catch (err) {
            console.error(err);
        }
    };
    /**
     * @description Get the current WP themes folder
     *
     * @return {Promise<string | void>}
     */
    static getThemesFolderPath = async () => {
        try {
            return path.resolve(`${await this.whereAmI()}/wp-content/themes`);
        }
        catch (err) {
            console.error(err);
            return;
        }
    };
    static checkFileExists = async (path, exit = false) => {
        try {
        }
        catch (err) {
            console.error(err);
        }
    };
}
