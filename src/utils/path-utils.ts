
require('dotenv').config();

// Core Modules
const path = require('path');
import {PathLike, readdirSync} from 'fs';

// Community Modules
import fs from 'fs-extra';
const fuzzy = require('fuzzy');
const { random } = require('lodash');

// Package modules
import DebugUtils from './debug-utils';

export default class PathUtils {
    /**
     * @description Gets the current path
     * @public
     *
     * @return string
     */
    public static whereAmI = async (): Promise<string> => {
        const isDebugFullMode: boolean = await DebugUtils.isDebugFullMode();

        // Enabled debug mode?
        if (isDebugFullMode) {

            return path.resolve(process.env.WORDPRESS_PATH);

        } else {

            return path.resolve(process.cwd());

        }
    }

    /**
     * @description  Check if the users is the root of the project or another folder
     * @public
     *
     * @return bool
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
     * @return string
     */
    public static getThemesFolderPath = async (): Promise<string | void> => {
        try {

            return path.resolve(`${await this.whereAmI()}/wp-content/themes`);

        } catch (err) {

            console.error(err);

            return;

        }

    };

    /**
     * @description Get all folder names in the theme directory
     *
     * @return Promise<Array<string>>
     */
    // public static getThemeFolderNames = async (): Promise<Array<string>> => {
    //     // Theme path
    //     const themePath: string | void = await this.getThemesFolderPath();
    //
    //     // Just get the top level folder names
    //     const getDirectories = readdirSync(themePath, { withFileTypes: true })
    //         .filter((dirent) => dirent.isDirectory())
    //         .map(dirent => dirent?.name);
    //
    //     return getDirectories;
    // };
}

/**
 * @description Gets the current path
 *
 * @return string
 */
// const whereAmI = function() {
//
//     if (isDebugMode && wordPressDebugPath) {
//
//         return path.resolve(process.env.WORDPRESS_PATH);
//
//     } else {
//
//         return path.resolve(process.cwd());
//
//     }
//
// };

/**
 * @description  Check if the users is the root of the project or another folder
 *
 * @return bool
 */
const isWordpressInstall = function() {

    return fs.pathExistsSync(`${whereAmI()}/wp-admin/admin-ajax.php`);

};

/**
 * @description
 *
 * @return string
 */
const getThemesFolderPath = function() {

    return path.resolve(`${whereAmI()}/wp-content/themes`);

};

// /**
//  * @description Get all folder names in the theme directory
//  *
//  * @return array
//  */
// const getThemeFolderNames = function() {
//     // Theme path
//     const themePath = getThemesFolderPath();
//
//     // Just get the top level folder names
//     const getDirectories = readdirSync(themePath, { withFileTypes: true })
//         .filter(dirent => dirent.isDirectory())
//         .map(dirent => dirent.name);
//
//     return getDirectories;
// };

// /**
//  * @description Search the custom folder for module names
//  *
//  * @param {string} answersSoFar
//  * @param {string} input
//  * @return {Promise<unknown>}
//  */
// const searchFolderNames = function(answersSoFar, input) {
//     const moduleNames = getThemeFolderNames();
//
//     input = input || '';
//
//     // Use fuzzy logic to based on the custom folders names and return for usage in adding to our module
//     return new Promise(function (resolve) {
//         setTimeout(function () {
//             let fuzzyResult = fuzzy.filter(input, moduleNames);
//
//             resolve(
//                 fuzzyResult.map(function (el) {
//                     return el.original;
//                 })
//             );
//         }, random(30, 500));
//     });
// }

// module.exports = {
//     whereAmI,
//     isWordpressInstall,
//     getThemesFolderPath,
//     getThemeFolderNames,
//     searchFolderNames,
// };
