import 'dotenv/config';
import path from 'path';
import fs from 'fs-extra';
import DebugUtils from './debug-utils.js';
export default class PathUtils {
    static whereAmI = async () => {
        const isDebugFullMode = await DebugUtils.isDebugFullMode();
        if (isDebugFullMode) {
            const wordPressDebugPath = process.env?.WORDPRESS_PATH ?? '';
            return path.resolve(wordPressDebugPath);
        }
        else {
            return path.resolve(process.cwd());
        }
    };
    static isWordpressInstall = async () => {
        try {
            return fs.pathExistsSync(`${await this.whereAmI()}/wp-admin/admin-ajax.php`);
        }
        catch (err) {
            console.error(err);
        }
    };
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
