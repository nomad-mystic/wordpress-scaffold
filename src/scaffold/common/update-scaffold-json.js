// Community modules
const fs = require('fs');
// Package modules
const { camelCaseToDash, addDashesToString, pascalCaseString, } = require('../../utils/string-utils');
const { whereAmI, } = require('../../utils/path-utils');
/**
 * @description Updates our internal JSON with properties for use later
 *
 * @param {string} filePath
 * @param {any} json
 * @return {string}
 */
const updateScaffoldJson = (filePath, json) => {
    require('./scaffold-internal').scaffoldInternal();
    // Setup our arrays for json update logic
    const dashedValues = [
        'project-name',
        'active-theme',
    ];
    const disallowedKeys = [
        'database-setup',
        'database-name',
        'database-password',
        'database-username',
        'site-admin-password',
        'site-admin-user',
        'admin-email',
    ];
    // Get our config file
    let jsonFile = fs.readFileSync(filePath, 'utf-8');
    // Baily Early
    if (!jsonFile || typeof jsonFile === 'undefined' || jsonFile === '') {
        return '';
    }
    // Create object
    let jsonFileParsed = JSON.parse(jsonFile);
    let property;
    for (property in json) {
        // Sanity Check
        if (Object.hasOwn(json, property) && property && typeof property !== 'undefined') {
            // These come through the CLI as camelCase
            let dashedProperty = camelCaseToDash(property);
            // What if there value isn't empty?
            if (json[property] && typeof json[property] === 'undefined' && json[property] !== '') {
                continue;
            }
            // Update the values
            if (json[property] &&
                typeof json[property] !== 'undefined' &&
                typeof json[property] === 'string' &&
                dashedValues.includes(dashedProperty)) {
                jsonFileParsed[`${dashedProperty}`] = addDashesToString(json[property].trim());
                // Pretty specific maybe refactor and abstract this out?
                if (dashedProperty === 'project-name') {
                    jsonFileParsed['project-namespace'] = pascalCaseString(jsonFileParsed['project-name']);
                    continue;
                }
                continue;
            }
            // Same information we don't want to save, so do that here
            if (typeof json[property] !== 'undefined' && !disallowedKeys.includes(dashedProperty)) {
                jsonFileParsed[`${dashedProperty}`] = json[property];
            }
        } // End sanity check
    } // End for
    // Write our updated values
    fs.writeFileSync(filePath, JSON.stringify(jsonFileParsed));
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};
export default updateScaffoldJson;
