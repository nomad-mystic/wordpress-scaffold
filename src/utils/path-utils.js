// Community Modules
require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const fuzzy = require('fuzzy');
const {readdirSync} = require('fs');
const { random } = require('lodash');

// Enable debug mode?
const isDebugMode = !!process.env?.DEBUG;
const wordPressDebugPath = !!process.env?.WORDPRESS_PATH;

/**
 * @description Gets the current path
 *
 * @return string
 */
const whereAmI = function() {

    if (isDebugMode && wordPressDebugPath) {

        return path.resolve(process.env.WORDPRESS_PATH);

    } else {

        return path.resolve(process.cwd());

    }

};

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

/**
 * @description Get all folder names in the theme directory
 *
 * @return array
 */
const getThemeFolderNames = function() {
    // Theme path
    const themePath = getThemesFolderPath();

    // Just get the top level folder names
    const getDirectories = readdirSync(themePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    return getDirectories;
};

/**
 * @description Search the custom folder for module names
 *
 * @param {string} answersSoFar
 * @param {string} input
 * @return {Promise<unknown>}
 */
const searchFolderNames = function(answersSoFar, input) {
    const moduleNames = getThemeFolderNames();

    input = input || '';

    // Use fuzzy logic to based on the custom folders names and return for usage in adding to our module
    return new Promise(function (resolve) {
        setTimeout(function () {
            let fuzzyResult = fuzzy.filter(input, moduleNames);

            resolve(
                fuzzyResult.map(function (el) {
                    return el.original;
                })
            );
        }, random(30, 500));
    });
}

module.exports = {
    whereAmI,
    isWordpressInstall,
    getThemesFolderPath,
    getThemeFolderNames,
    searchFolderNames,
};
