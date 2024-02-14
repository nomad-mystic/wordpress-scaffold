// Core Modules
import fs from 'fs';
import path from 'path';

// Community modules
import fse from "fs-extra";

// Package modules
// Utils
import StringUtils from '../../utils/string-utils.js';
import PathUtils from '../../utils/path-utils.js';
import MessagingUtils from '../../utils/messaging-utils.js';
import { packageRootDir } from '../../utils/package-root.js';

// Interfaces
import InterfaceActivePlugins from '../../interfaces/project/interface-active-plugins.js';
import ProjectConfig from '../../interfaces/project/interface-project-config.js';

import { scaffoldInternal } from './scaffold-internal.js';
import DebugUtils from "../../utils/debug-utils.js";

/**
 * @description Updates our internal JSON with properties for use later
 * @deprecated Use class ProjectJson
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

/**
 * @classdesc Perform tasks for updating the internal JSON file
 * @class ProjectJson
 * @author Keith Murphy | nomadmystics@gmail.com
 */
export class ProjectJson {
    /**
     * @type boolean
     * @private
     */
    private static isDebugFullMode: boolean = false;

    /**
     * @type string
     * @private
     */
    private static whereAmI: string = '';

    /**
     * @type string
     * @private
     */
    private static configFilePath: string = '';

    // Setup our arrays for json update logic
    private static dashedValues: Array<string> = [
        'project-name',
        'active-theme',
    ];

    /**
     * @type Array<string>
     * @private
     */
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

    /**
     * @description Starting point for updating the internal config
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {object} configUpdates
     * @param {string} type
     * @return {Promise<object | any>}
     */
    public static update = async (configUpdates: object, type: string = ''): Promise<object | any> => {
        try {
            // Gather our location
            this.whereAmI = await PathUtils.whereAmI();

            // Check for debug mode values
            this.isDebugFullMode = await DebugUtils.isDebugFullMode();

            // Make sure we have the Project JSON scaffolded
            await this.scaffoldInternal();

            // Get our config file
            this.configFilePath = `${this.whereAmI}/internal/project/project-config.json`;

            let projectConfigObject = await this.getProjectConfigObject();

            projectConfigObject = await this.performRootJsonUpdate(projectConfigObject, configUpdates);

            // Some times need specific updates handel them here
            if (type === 'plugin') {
                projectConfigObject = await this.performPluginJsonUpdate(projectConfigObject, configUpdates);
            }

            await this.saveFile(projectConfigObject);

            return projectConfigObject;

        } catch (err: any) {
            console.log('ProjectJson.update()');
            console.error(err);
        }
    };

    /**
     * @description Save our internal JSON file
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {ProjectConfig} projectConfigObject
     * @return {Promise<void>}
     */
    private static saveFile = async (projectConfigObject: ProjectConfig): Promise<void> => {
        try {

            // Write our updated values
            fs.writeFileSync(this.configFilePath, JSON.stringify(projectConfigObject));

            // Let the user know
            await MessagingUtils.displayColoredMessage('The internal project config file has been saved.', 'green');

        } catch (err: any) {
            console.log('ProjectJson.saveFile()');
            console.error(err);
        }
    };

    /**
     * @description Make sure we have our internal folder, if not copy it over
     *
     * @return void
     */
    public static scaffoldInternal = async (): Promise<void> => {
        try {

            if (!fs.existsSync(`${this.whereAmI}/internal`)) {

                fse.copySync(`${path.join(packageRootDir + '/scaffolding/internal')}`, `${this.whereAmI}/internal`, { overwrite: false });

            }

        } catch (err: any) {
            console.log('ProjectJson.scaffoldInternal()');
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
            console.log('ProjectJson.getProjectConfigObject');
            console.error(err);

        }
    };

    /**
     * @description Updates the root level config values
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {any} projectConfigObject
     * @param {any} configUpdates
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
     * @description Update our internal config with plugin specific values
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {any} projectConfigObject
     * @param {any} configUpdates
     * @return { Promise<object | any>}
     */
    private static performPluginJsonUpdate = async (projectConfigObject: any, configUpdates: any): Promise<object | any> => {
        try {
            let activePlugins: Array<InterfaceActivePlugins> = projectConfigObject['active-plugins'];

            const alreadyExists: boolean | undefined = await this.cleanUpPluginArray(activePlugins, configUpdates);

            // Push our update or let the user know one already exists
            if (!alreadyExists) {

                activePlugins.push(configUpdates);

            } else {

                console.log(`Plugin ${configUpdates['plugin-name']} already exists in the schema. Please try another name.`)
                process.exit(1);

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

    /**
     * @description Do some checks and clean up for the active-plugins object
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {Array<InterfaceActivePlugins>} activePlugins
     * @param {any} configUpdates
     * @return {Promise<boolean | undefined>}
     */
    private static cleanUpPluginArray = async (activePlugins: Array<InterfaceActivePlugins>, configUpdates: any): Promise<boolean | undefined> => {
        try {
            let alreadyExists: boolean = false;

            // Check if we have an active key by the same name
            for (let plugin: number = 0; plugin < activePlugins.length; plugin++) {
                if (activePlugins[plugin] && typeof activePlugins[plugin] !== 'undefined') {

                    const currentPlugin = await this.deleteUnusedPluginProperties(activePlugins[plugin]);

                    // Since this doesn't exist remove it from our array
                    if (!currentPlugin || typeof currentPlugin === 'undefined' || Object.keys(currentPlugin).length === 0) {
                        activePlugins.splice(plugin, 1);
                    }

                    // We have a plugin with the same name
                    if (activePlugins[plugin]?.['plugin-name'] && activePlugins[plugin]?.['plugin-name'] === configUpdates['plugin-name']) {

                        // There is a valid path and plugin with the same name
                        if (fs.existsSync(activePlugins[plugin]?.['plugin-path'])) {
                            alreadyExists = true;
                        }
                    }
                }
            }

            return alreadyExists;

        } catch (err: any) {
            console.log('ProjectJson.cleanUpPluginArray()');
            console.error(err);
        }
    };

    /**
     * @description
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {InterfaceActivePlugins} plugin
     * @return {Promise<void>}
     */
    private static deleteUnusedPluginProperties = async (plugin: InterfaceActivePlugins): Promise<InterfaceActivePlugins | any> => {
        try {
            let currentPlugin: InterfaceActivePlugins = plugin;

            // Remove the object since the path for the plugin doesn't exist
            if (!fs.existsSync(currentPlugin?.['plugin-path'])) {
                delete currentPlugin['plugin-name'];
                // @ts-ignore
                delete currentPlugin['plugin-path'];
                delete currentPlugin['plugin-description'];
                delete currentPlugin['plugin-front-end-framework'];
            }

            return currentPlugin;
        } catch (err: any) {
            console.log('ProjectJson.deleteUnusedPluginProperties()');
            console.error(err);
        }
    };
}

export default updateInternalJson;
