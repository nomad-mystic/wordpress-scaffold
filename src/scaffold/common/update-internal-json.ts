// Community modules
import fs from 'fs';

// Package modules
import StringUtils from '../../utils/string-utils.js';
import {scaffoldInternal} from './scaffold-internal.js';
import PathUtils from "../../utils/path-utils.js";
import ProjectConfig from "../../interfaces/project/interface-project-config.js";
import ActivePlugins from "../../interfaces/project/interface-active-plugins.js";

/**
 * @description Updates our internal JSON with properties for use later
 *
 * @param {string} filePath
 * @param {any} json
 * @param {boolean} isPlugin
 * @return {string}
 */
const updateInternalJson = async (filePath: string, json: any, isPlugin: boolean = false): Promise<string | any> => {
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

        console.log('updateInternalJson()');
        console.error(err);

    }
};

export class ProjectJson {
    private static isDebugFullMode: boolean = false;
    private static whereAmI: string = '';
    private static configFilePath: string = '';

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
        'plugin-name',
        'plugin-path',
        'plugin-description',
        'plugin-front-end-framework',
    ];

    public static update = async (configUpdates: object, type: string = ''): Promise<object | any> => {
        try {
            // Make sure we have the Project JSON scaffolded
            await scaffoldInternal();

            // Gather our location
            this.whereAmI = await PathUtils.whereAmI();

            // Get our config file
            this.configFilePath = `${this.whereAmI}/internal/project/project-config.json`;

            let projectConfigObject = await this.getProjectConfigObject();

            projectConfigObject = await this.performRootJsonUpdate(projectConfigObject, configUpdates);

            if (type === 'plugin') {
                projectConfigObject = await this.performPluginJsonUpdate(projectConfigObject, configUpdates);
            }

            // await this.saveFile(projectConfigObject);

            return projectConfigObject;

        } catch (err: any) {
            console.log('UpdateProjectJson.update()');
            console.error(err);
        }
    };

    /**
     * @description
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return {Promise<void>}
     */
    private static saveFile = async (projectConfigObject: ProjectConfig): Promise<void> => {
        try {

            // Write our updated values
            fs.writeFileSync(this.configFilePath, JSON.stringify(projectConfigObject));

            // Let the user know
            console.log('The internal project config file has been saved.')

        } catch (err: any) {
            console.log('UpdateProjectJson.saveFile()');
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
    public static getProjectConfigObject = async (): Promise<ProjectConfig | any> => {
        try {

            let jsonFile: string = fs.readFileSync(this.configFilePath, 'utf-8');

            // Baily Early
            if (!jsonFile || typeof jsonFile === 'undefined' || jsonFile === '') {
                return '';
            }

            return JSON.parse(jsonFile);

        } catch (err: any) {
            console.log('getProjectConfigObject')
            console.error(err);

        }
    };

    /**
     * @description Updates the root level config values
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return {Promise<object | any>}
     */
    private static performRootJsonUpdate = async (projectConfigObject: any, configUpdates: any): Promise<object | any> => {
        try {
            let property: keyof typeof configUpdates;

            for (property in configUpdates) {
                // Sanity Check
                if (Object.hasOwn(configUpdates, property) && property && typeof property !== 'undefined') {
                    // These come through the CLI as camelCase
                    let dashedProperty: string = await StringUtils.camelCaseToDash(property);

                    // What if there value isn't empty?
                    if (configUpdates[property] &&
                        typeof configUpdates[property] === 'undefined' &&
                        configUpdates[property] !== ''
                    ) {
                        continue;
                    }

                    // Update the values
                    if (configUpdates[property] &&
                        typeof configUpdates[property] !== 'undefined' &&
                        typeof configUpdates[property] === 'string' &&
                        this.dashedValues.includes(dashedProperty)
                    ) {
                        projectConfigObject[`${dashedProperty}`] = await StringUtils.addDashesToString(configUpdates[property].trim());

                        // @todo Pretty specific maybe refactor and abstract this out?
                        if (dashedProperty === 'project-name') {
                            projectConfigObject['project-namespace'] = await StringUtils.pascalCaseString(projectConfigObject['project-name']);

                            continue;
                        }

                        continue;
                    }

                    // Some information we don't want to save, so do that here
                    if (typeof configUpdates[property] !== 'undefined' && !this.disallowedKeys.includes(dashedProperty)) {
                        projectConfigObject[`${dashedProperty}`] = configUpdates[property];
                    }

                } // End sanity check
            } // End for

            return JSON.parse(fs.readFileSync(this.configFilePath, 'utf-8'));

        } catch (err: any) {
            console.log('ProjectJson.performRootJsonUpdate()');
            console.error(err);
        }
    };

    /**
     * @description
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {any} projectConfigObject
     * @param {any} configUpdates
     * @return { Promise<object | any>}
     */
    private static performPluginJsonUpdate = async (projectConfigObject: any, configUpdates: any): Promise<object | any> => {
        try {
            let alreadyExists: boolean = false;
            let activePlugins: Array<ActivePlugins> = projectConfigObject['active-plugins'];

            // Check if we have an active key by the same name
            for (let plugin: number = 0; plugin < activePlugins.length; plugin++) {
                if (activePlugins[plugin] && typeof activePlugins[plugin] !== 'undefined') {

                    if (activePlugins[plugin]?.['plugin-name'] && activePlugins[plugin]?.['plugin-name'] === configUpdates['plugin-name']) {

                        alreadyExists = true;

                        break;
                    }
                }
            }

            // Push our update or let the user know one already exists
            if (!alreadyExists) {

                activePlugins.push(configUpdates);

            } else {

                console.log(`Plugin ${configUpdates['plugin-name']} already exists in the schema. Please try another name.`)

            }

            projectConfigObject['active-plugins'] = activePlugins;

            if (this.isDebugFullMode) {
                console.log('ProjectJson.performPluginJsonUpdate()');

                console.log('projectConfigObject');
                console.log(projectConfigObject);

                console.log('configUpdates');
                console.log(configUpdates);
            }

            return projectConfigObject;

        } catch (err: any) {
            console.log('ProjectJson.performPluginJsonUpdate()');
            console.error(err);
        }
    }
}


export default updateInternalJson;
