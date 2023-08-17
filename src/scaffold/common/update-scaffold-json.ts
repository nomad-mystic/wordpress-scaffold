// Community modules
import fs from 'fs';

// Package modules
import StringUtils from '../../utils/string-utils.js';
import { scaffoldInternal } from './scaffold-internal.js';
import PathUtils from "../../utils/path-utils.js";

/**
 * @description Updates our internal JSON with properties for use later
 *
 * @param {string} filePath
 * @param {any} json
 * @param {boolean} isPlugin
 * @return {string}
 */
const updateScaffoldJson = async (filePath: string, json: any, isPlugin: boolean = false): Promise<string | any> => {
    try {
        await scaffoldInternal();

        // Setup our arrays for json update logic
        const dashedValues: Array<string> = [
            'project-name',
            'active-theme',
        ];

        const disallowedKeys: Array<string> = [
            'database-setup',
            'database-name',
            'database-password',
            'database-username',
            'site-admin-password',
            'site-admin-user',
            'admin-email',
        ];

        // Get our config file
        let jsonFile: string = fs.readFileSync(filePath, 'utf-8');

        // Baily Early
        if (!jsonFile || typeof jsonFile === 'undefined' || jsonFile === '') {
            return '';
        }

        // Create object
        let jsonFileParsed = JSON.parse(jsonFile);

        let property: keyof typeof json;

        for (property in json) {
            // Sanity Check
            if (Object.hasOwn(json, property) && property && typeof property !== 'undefined') {
                // These come through the CLI as camelCase
                let dashedProperty: string = await StringUtils.camelCaseToDash(property);

                // What if there value isn't empty?
                if (json[property] && typeof json[property] === 'undefined' && json[property] !== '') {
                    continue;
                }

                // Update the values
                if (json[property] &&
                    typeof json[property] !== 'undefined' &&
                    typeof json[property] === 'string' &&
                    dashedValues.includes(dashedProperty)
                ) {
                    jsonFileParsed[`${dashedProperty}`] = await StringUtils.addDashesToString(json[property].trim());

                    // @todo Pretty specific maybe refactor and abstract this out?
                    if (dashedProperty === 'project-name') {
                        jsonFileParsed['project-namespace'] = await StringUtils.pascalCaseString(jsonFileParsed['project-name']);

                        continue;
                    }

                    continue;
                }

                // Some information we don't want to save, so do that here
                if (typeof json[property] !== 'undefined' && !disallowedKeys.includes(dashedProperty)) {
                    jsonFileParsed[`${dashedProperty}`] = json[property];
                }

            } // End sanity check
        } // End for

        // Write our updated values
        fs.writeFileSync(filePath, JSON.stringify(jsonFileParsed));

        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    } catch (err) {

        console.log('updateScaffoldJson()');
        console.error(err);

    }
};

export class UpdateProjectJson {
    private static isDebugFullMode: boolean = false;
    private static whereAmI: string = '';

    // Setup our arrays for json update logic
    private static dashedValues: Array<string> = [
        'project-name',
        'active-theme',
    ];

    private static disallowedKeys: Array<string> = [
        'database-setup',
        'database-name',
        'database-password',
        'database-username',
        'site-admin-password',
        'site-admin-user',
        'admin-email',
    ];

    public static update = async (configUpdates: any, isPlugin: boolean = false): Promise<string | any> => {
        try {
            // Make sure we have the Project JSON scaffolded
            await scaffoldInternal();

            // Gather our location
            this.whereAmI = await PathUtils.whereAmI();

            const projectConfigObject = await this.getProjectConfigObject();

            console.log(projectConfigObject);

        } catch (err: any) {

            console.error(err);

        }
    };

    /**
     * @description Get the "Global" project config
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<string | object | any>
     */
    public static getProjectConfigObject = async (): Promise<string | object | any> => {
        try {

            // Get our config file
            const configFilePath: string = `${this.whereAmI}/internal/project/project-config.json`;

            let jsonFile: string = fs.readFileSync(configFilePath, 'utf-8');

            // Baily Early
            if (!jsonFile || typeof jsonFile === 'undefined' || jsonFile === '') {
                return '';
            }

            return JSON.parse(jsonFile);

        } catch (err: any) {

            console.error(err);

        }
    };
}


export default updateScaffoldJson;
