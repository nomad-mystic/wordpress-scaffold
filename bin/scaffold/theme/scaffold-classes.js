// Community modules
const fse = require('fs-extra');
const path = require('path');
const fs = require('fs');
const colors = require('colors');

// Package Modules
const {
    whereAmI,
    isWordpressInstall,
    getThemesFolderPath,
} = require('../../utils/path-utils');

const {
    updateScaffoldFile,
} = require('../common/update-scaffold-file');

/**
 * @description
 *
 * @param {Object} answers
 * @param {string} answers.themeName
 * @param {string} answers.themeDescription
 * @param {boolean} answers.addWebpack
 * @param {string} themeName
 * @param {string} themesPath
 * @param {string} newThemePath
 * @param {string} themeDescription
 * @param {string} frontEndFramework
 * @param {boolean} addWebpack
 * @param {string} safeThemeName
 * @param {string} capAndSnakeCaseTheme
 * @param {string} projectNamespace
 *
 * @return void
 */
const updateScaffoldClasses = (answers, {
    themeName,
    themesPath,
    newThemePath,
    themeDescription,
    frontEndFramework,
    safeThemeName,
    capAndSnakeCaseTheme,
    projectName,
    projectNamespace,
}) => {
    try {
        let updateObjectsArray = [];

        // Create our checks before we start the copy process
        const composerExists = fse.pathExistsSync(`${whereAmI()}/composer.json`);
        const themeClassListExists = fse.pathExistsSync(`${whereAmI()}/internal/theme/class-list.json`);

        // Let the user know?
        if (themeClassListExists) {
            const classListObjects = [
                {
                    updatePath: `${whereAmI()}/internal/theme`,
                    fileName: 'class-list.json',
                    stringToUpdate: 'PASCAL_NAME',
                    updateString: projectNamespace,
                }
            ];

            updateObjectsArray.push(...classListObjects);
        }

        // console.log(themeClassListExists);
        // console.log(updateObjectsArray);

        // Update our files based on object properties
        for (let update = 0; update < updateObjectsArray.length; update++) {
            if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {

                updateScaffoldFile(
                    updateObjectsArray[update].updatePath,
                    updateObjectsArray[update].fileName,
                    {
                        stringToUpdate: updateObjectsArray[update].stringToUpdate,
                        updateString: updateObjectsArray[update].updateString,
                    }
                );

            }
        }
    } catch (err) {

        console.error(err);

    }
};

module.exports = updateScaffoldClasses;
