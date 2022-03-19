// Community modules
const fse = require('fs-extra');
const path = require('path');
const fs = require('fs');
const colors = require('colors');
const glob = require('glob');

// Package Modules
const {
    whereAmI,
    isWordpressInstall,
    getThemesFolderPath,
} = require('../../utils/path-utils');

const {
    updateScaffoldFile,
} = require('../common/update-scaffold-file');

const {
    getComposerPropertyInfo,
} = require('../../utils/composer-utils');

const {
    updateClassListPaths,
} = require('../../utils/class-list-utils');

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

        const phpFiles = glob.sync(`${newThemePath}/classes/**/*.php`, {
            nodir: true,
        });

        // let classFileUpdates = [];
        //
        // // For each of the classes we scaffold replace their namespace names
        // if (phpFiles && typeof phpFiles !== 'undefined' && phpFiles.length > 0) {
        //     for (let classPath = 0; classPath < phpFiles.length; classPath++) {
        //
        //         if (phpFiles[classPath] && typeof phpFiles[classPath] !== 'undefined') {
        //             let classObject = {};
        //
        //             console.log(phpFiles[classPath]);
        //
        //             // Extract the information we need
        //             const afterLastSlash = phpFiles[classPath].substring(phpFiles[classPath].lastIndexOf('/') + 1);
        //             const beforeLastSlash = phpFiles[classPath].match(/^(.*[\\\/])/);
        //
        //             classObject.updatePath = beforeLastSlash[0].slice(0, -1);
        //             classObject.fileName = afterLastSlash;
        //             classObject.stringToUpdate = 'PASCAL_NAME';
        //             classObject.updateString = projectNamespace;
        //
        //             classFileUpdates.push(classObject);
        //         }
        //     }
        //
        //     updateObjectsArray.push(...classFileUpdates);
        // }
        //
        // // Let the user know?
        // if (themeClassListExists) {
        //     const classListObjects = [
        //         {
        //             updatePath: `${whereAmI()}/internal/theme`,
        //             fileName: 'class-list.json',
        //             stringToUpdate: 'PASCAL_NAME',
        //             updateString: projectNamespace,
        //         }
        //     ];
        //
        //     updateObjectsArray.push(...classListObjects);
        // }
        //
        // console.log(updateObjectsArray);

        const composerInfo = getComposerPropertyInfo();

        updateClassListPaths(`${whereAmI()}/internal/theme/class-list.json`, composerInfo);

        // // Update our files based on object properties
        // for (let update = 0; update < updateObjectsArray.length; update++) {
        //     if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {
        //
        //         updateScaffoldFile(
        //             updateObjectsArray[update].updatePath,
        //             updateObjectsArray[update].fileName,
        //             {
        //                 stringToUpdate: updateObjectsArray[update].stringToUpdate,
        //                 updateString: updateObjectsArray[update].updateString,
        //             }
        //         );
        //
        //     }
        // }
    } catch (err) {

        console.error(err);

    }
};

module.exports = updateScaffoldClasses;
