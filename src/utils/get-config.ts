// Core Modules
import fs from 'fs';

// Package Modules
import PathUtils from './path-utils.js';

/**
 * @description Grab an internal config file
 *
 * @param  configPath
 * @returns {Promise<any>}
 */
export const getInternalConfig = async (configPath: string): Promise<any> => {
    // Check our project config for projects name
    const configFilePath: string = `${await PathUtils.whereAmI()}/internal/${configPath}`;

    let jsonFile: string = fs.readFileSync(configFilePath, 'utf-8');

    if (!jsonFile || typeof jsonFile === 'undefined' || jsonFile === '') {
        return {};
    }

    return JSON.parse(jsonFile);
};
