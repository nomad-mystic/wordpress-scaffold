"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
// Core Modules
const path = require('path');
// Community Modules
const fs_extra_1 = __importDefault(require("fs-extra"));
const fuzzy = require('fuzzy');
const { random } = require('lodash');
// Package modules
const debug_utils_1 = __importDefault(require("./debug-utils"));
class PathUtils {
    /**
     * @description Gets the current path
     * @public
     *
     * @return string
     */
    static whereAmI = async () => {
        const isDebugFullMode = await debug_utils_1.default.isDebugFullMode();
        // Enabled debug mode?
        if (isDebugFullMode) {
            return path.resolve(process.env.WORDPRESS_PATH);
        }
        else {
            return path.resolve(process.cwd());
        }
    };
    /**
     * @description  Check if the users is the root of the project or another folder
     * @public
     *
     * @return bool
     */
    static isWordpressInstall = async () => {
        try {
            return fs_extra_1.default.pathExistsSync(`${await this.whereAmI()}/wp-admin/admin-ajax.php`);
        }
        catch (err) {
            console.error(err);
        }
    };
    /**
     * @description Get the current WP themes folder
     *
     * @return string
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
}
exports.default = PathUtils;
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
const isWordpressInstall = function () {
    return fs_extra_1.default.pathExistsSync(`${whereAmI()}/wp-admin/admin-ajax.php`);
};
/**
 * @description
 *
 * @return string
 */
const getThemesFolderPath = function () {
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
