const fs = require("fs");
const fse = require('fs-extra');

const { whereAmI } = require('./path-utils');

/**
 * @description
 *
 * @returns {*[]}
 */
const getComposerPropertyInfo = () => {
    const composerExists = fse.pathExistsSync(`${whereAmI()}/composer.json`);
    let propertyValues = [];

    // For each of the folders in the classes folder update class-list.json file with their paths
    // Use the paths and namespaces from the composer.json and update our json
    // @todo This might be used in heal command? and if they install another theme!
    //      Change the name prop and paths
    if (composerExists) {
        // Get our file in memory
        const composerContents = fs.readFileSync(`${whereAmI()}/composer.json`, 'utf8');
        let composerJson = JSON.parse(composerContents);

        if (composerJson && typeof composerJson.autoload !== 'undefined' && typeof composerJson.autoload['psr-4'] !== 'undefined') {
            const Psr4 = composerJson.autoload['psr-4'];

            for (let namespaceValue in Psr4) {
                if (Psr4.hasOwnProperty(namespaceValue)) {
                    let namespaceName = namespaceValue;
                    let namespacePath = Psr4[namespaceValue][0];

                    let namespace = null;
                    let path = null;

                    // Build our values for the final object
                    if (namespaceName && typeof namespaceName !== 'undefined' && typeof namespaceName === 'string') {

                        namespace = namespaceName.replaceAll('\\', '');

                    }

                    if (namespacePath && typeof namespacePath !== 'undefined' && namespacePath.length > 0) {

                        path = namespacePath[0];

                    }

                    // Make sure we have our properties
                    if (namespace && path) {
                        propertyValues.push({
                            namespace: namespace,
                            path: namespacePath,
                        });
                    }

                }
            } // End for...in

            return propertyValues
        } // End sanity check
    } // End sanity check

    return [];
};

/**
 * @description
 *
 * @param {string} replaceValue
 */
const updateComposerInfo = (replaceValue) => {

};

module.exports = {
    getComposerPropertyInfo,
    updateComposerInfo,
}
