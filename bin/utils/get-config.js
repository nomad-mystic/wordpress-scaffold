const {whereAmI} = require("./path-utils");
const fs = require("fs");

/**
 *
 * @param  config
 * @returns {{}|any}
 */
const getInternalConfig = (config) => {
    // Check our project config for projects name
    const configFilePath = `${whereAmI()}/internal/${config}`;

    let jsonFile = fs.readFileSync(configFilePath, 'utf-8');

    if (!jsonFile || typeof jsonFile === 'undefined' || jsonFile === '') {
        return {};
    }

    return JSON.parse(jsonFile);
};

module.exports = {
    getInternalConfig,
};
