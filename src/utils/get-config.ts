import PathUtils from './path-utils.js';
import fs from 'fs';

/**
 * @description Grab an internal config file
 *
 * @param  configPath
 * @returns {{}|any}
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
