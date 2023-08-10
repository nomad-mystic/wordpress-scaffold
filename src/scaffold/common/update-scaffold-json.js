import fs from 'fs';
import StringUtils from '../../utils/string-utils.js';
import { scaffoldInternal } from './scaffold-internal.js';
const updateScaffoldJson = async (filePath, json) => {
    try {
        await scaffoldInternal();
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
        let jsonFile = fs.readFileSync(filePath, 'utf-8');
        if (!jsonFile || typeof jsonFile === 'undefined' || jsonFile === '') {
            return '';
        }
        let jsonFileParsed = JSON.parse(jsonFile);
        let property;
        for (property in json) {
            if (Object.hasOwn(json, property) && property && typeof property !== 'undefined') {
                let dashedProperty = await StringUtils.camelCaseToDash(property);
                if (json[property] && typeof json[property] === 'undefined' && json[property] !== '') {
                    continue;
                }
                if (json[property] &&
                    typeof json[property] !== 'undefined' &&
                    typeof json[property] === 'string' &&
                    dashedValues.includes(dashedProperty)) {
                    jsonFileParsed[`${dashedProperty}`] = await StringUtils.addDashesToString(json[property].trim());
                    if (dashedProperty === 'project-name') {
                        jsonFileParsed['project-namespace'] = await StringUtils.pascalCaseString(jsonFileParsed['project-name']);
                        continue;
                    }
                    continue;
                }
                if (typeof json[property] !== 'undefined' && !disallowedKeys.includes(dashedProperty)) {
                    jsonFileParsed[`${dashedProperty}`] = json[property];
                }
            }
        }
        fs.writeFileSync(filePath, JSON.stringify(jsonFileParsed));
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    catch (err) {
        console.log('updateScaffoldJson()');
        console.error(err);
    }
};
export default updateScaffoldJson;
