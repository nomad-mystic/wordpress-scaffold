import 'dotenv/config';

// Core Modules
import path from 'path';
import { PathLike, readdirSync } from 'fs';

// Community Modules
import fs from 'fs-extra';
import fuzzy from 'fuzzy';
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
    public static whereAmI = async (): Promise<string> => {
        const isDebugFullMode: boolean = await DebugUtils.isDebugFullMode();

        // Enabled debug mode?
        if (isDebugFullMode) {
            const wordPressDebugPath: string = process.env?.WORDPRESS_PATH ?? '';

            return path.resolve(wordPressDebugPath);

        } else {

            return path.resolve(process.cwd());

        }
    }

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
    }

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

            return;

        }

    };

    public static checkFileExists = async (path: string, exit = false): Promise<void> => {
        try {


        } catch (err) {

            console.error(err);

        }
    }
}

