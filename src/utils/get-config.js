import fs from 'fs';
import PathUtils from './path-utils.js';
export const getInternalConfig = async (configPath) => {
    const configFilePath = `${await PathUtils.whereAmI()}/internal/${configPath}`;
    let jsonFile = fs.readFileSync(configFilePath, 'utf-8');
    if (!jsonFile || typeof jsonFile === 'undefined' || jsonFile === '') {
        return {};
    }
    return JSON.parse(jsonFile);
};
