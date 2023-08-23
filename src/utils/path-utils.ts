import 'dotenv/config';

// Core Modules
import path from 'path';
import { PathLike, readdirSync } from 'fs';

// Community Modules
import fs from 'fs-extra';
import colors from 'colors';

// Package modules
import DebugUtils from './debug-utils.js';

/**
 * @class
 * @classdesc
 * @author Keith Murphy | nomadmystics@gmail.com
 */
export default class PathUtils {
    /**
     * @description Gets the current path
     * @public
     *
     * @return {Promise<string>}
     */
    public static whereAmI = async (): Promise<string> => {
        const isDebugFullMode: boolean = await DebugUtils.isDebugFullMode();

        // Enabled debug mode?
        if (isDebugFullMode) {
            const wordPressDebugPath: string = process.env?.WORDPRESS_PATH ?? '';

            return path.resolve(wordPressDebugPath);

        } else {

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
    public static isWordpressInstall = async (): Promise<boolean | undefined> => {
        try {

            return fs.pathExistsSync(`${await this.whereAmI()}/wp-admin/admin-ajax.php`);

        } catch (err) {

            console.error(err);

        }
    };

    /**
     * @description Get the current WP themes folder
     *
     * @return {Promise<string | void>}
     */
    public static getThemesFolderPath = async (): Promise<string | undefined> => {
        try {

            return path.resolve(`${await this.whereAmI()}/wp-content/themes`);

        } catch (err) {

            console.error(err);

        }
    };

    /**
     * @description Get the current WP themes folder
     *
     * @return {Promise<string | void>}
     */
    public static getPluginsFolderPath = async (): Promise<string | undefined> => {
        try {

            return path.resolve(`${await this.whereAmI()}/wp-content/plugins`);

        } catch (err) {

            console.error(err);

        }
    };

    /**
     * @description Make sure we have a WordPress install at this root folder
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<void>
     */
    public static checkForWordPressInstall  = async (): Promise<void> => {
        try {
            // Enable debug mode?
            const isDebugMode: boolean = await DebugUtils.isDebugMode();
            const isInstalled: boolean | undefined = await PathUtils.isWordpressInstall();

            // Let the user know they need to be in the root of the project and bail early
            if (!isInstalled && !isDebugMode) {

                console.log(colors.yellow('Your path is not at the root of your WordPress install.'));
                console.log(colors.yellow(`You are located at ${this.whereAmI}`));
                console.log(colors.yellow('Please move to the root WordPress install folder.'));

                process.exit(1);
            }

        } catch (err: any) {
            console.log('ScaffoldTheme.checkForWordPressInstall()');
            console.error(err);

        }
    };

    /**
     * @description
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return
     */
    public static validateIsPathWithDisplay = async (path: string, message: string, exit: boolean = false): Promise<void> => {
        try {

            if (fs.existsSync(path)) {
                console.log(colors.red(message));

                if (exit) {
                    process.exit(0);
                }
            }

        } catch (err: any) {

            console.error(err);

        }
    };


    /**
     * @description
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return {Promise<boolean | any>}
     */
    public static validateIsPath = async (path: string): Promise<boolean | any> => {
        try {

            return fs.existsSync(path);

        } catch (err: any) {
            console.log('validateIsPath');
            console.error(err);
        }
    };
}

