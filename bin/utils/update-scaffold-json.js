// Community modules
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

// Package modules
const {
    camelCaseToDash, addDashesToString, pascalCaseString,
} = require('./string-utils');

const {
    whereAmI,
} = require('./path-utils');

/**
 * @description Updates our internal JSON with properties for use later
 *
 * @param {string} filePath
 * @param {object} json
 * @return void
 */
const updateScaffoldJson = (filePath, json) => {
    // Make sure we have our internal folder, if not copy it over
    if (!fs.existsSync(`${whereAmI()}/internal`)) {

        fse.copySync(`${path.join(__dirname + '../../../scaffolding/internal')}`, `${whereAmI()}/internal`, {overwrite: false});

    }

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
    ];

    // Update our config file
    let jsonFile = fs.readFileSync(filePath, 'utf-8');

    if (!jsonFile || typeof jsonFile === 'undefined' || jsonFile === '') {
        return;
    }

    let jsonFileParsed = JSON.parse(jsonFile);

    for (const property in json) {
        // Sanity Check
        if (json.hasOwnProperty(property) && property && typeof property !== 'undefined') {
            // These come through the CLI as camelCase
            let dashedProperty = camelCaseToDash(property);

            // What if there value isn't empty?
            if (json[property] && typeof json[property] === 'undefined' && json[property] !== '') {
                continue;
            }

            if (jsonFileParsed[dashedProperty] && typeof jsonFileParsed[dashedProperty] !== 'undefined' && jsonFileParsed[dashedProperty] !== '') {
                continue;
            }

            // Update the values
            if (dashedValues.includes(dashedProperty)) {
                jsonFileParsed[`${dashedProperty}`] = addDashesToString(json[property].trim());

                // Pretty specific maybe refactor and abstract this out?
                if (dashedProperty === 'project-name') {
                    jsonFileParsed['project-namespace'] = pascalCaseString(jsonFileParsed['project-name']);

                    continue;
                }

                continue;
            }

            // Default to raw
            if (!disallowedKeys.includes(dashedProperty)) {
                jsonFileParsed[`${dashedProperty}`] = json[property];
            }

        } // End sanity check
    } // End for

    // Write our updated values
    fs.writeFileSync(filePath, JSON.stringify(jsonFileParsed));
};

module.exports = updateScaffoldJson;
