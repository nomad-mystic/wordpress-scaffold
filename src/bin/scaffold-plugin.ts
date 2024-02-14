#!/usr/bin/env node

// Community modules
import 'dotenv/config';
import fse from "fs-extra";

// Package modules
// Classes
import InquirerCli from '../cli/inquirer-cli.js';
import AbstractScaffold from '../abstract/abstract-scaffold.js';
import updateInternalJson, { ProjectJson } from '../scaffold/common/update-internal-json.js';

// Utils
import PathUtils from '../utils/path-utils.js';
import StringUtils from '../utils/string-utils.js';

// Interfaces
import InterfacePluginAnswers from '../interfaces/plugin/interface-plugin-anwsers.js';
import InterfacePluginAnswerValues from '../interfaces/plugin/interface-plugin-answer-values.js';
import InterfacePluginConfig from '../interfaces/plugin/interface-plugin-config.js';
import InterfaceScaffoldCopyFolders from '../interfaces/common/interface-scaffold-copy-folders.js';
import InterfaceScaffoldJsonUpdates from '../interfaces/common/interface-scaffold-json-updates.js';

// Functions
import getPluginOptions from '../config/plugin-options.js';
import UpdateTypeFiles from '../scaffold/common/update-type-files.js';
import MessagingUtils from '../utils/messaging-utils.js';
import CreateObjectArrays from '../scaffold/common/create-object-arrays.js';
import DebugUtils from "../utils/debug-utils.js";

/**
 * @classdesc Scaffold a new theme based on user's inputs
 * @class ScaffoldTheme
 * @extends AbstractScaffold
 * @author Keith Murphy | nomadmystics@gmail.com
 */
class ScaffoldPlugin extends AbstractScaffold {
    /**
     * @type boolean
     * @private
     */
    private static isDebugFullMode: boolean = false;

    /**
     * @type boolean
     * @private
     */
    private static composerAlreadyExists: boolean | any = false;

    /**
     * @type boolean
     * @private
     */
    private static packageAlreadyExists: boolean | any = false;

    /**
     * @type InterfacePluginAnswerValues
     * @private
     */
    private static pluginValues: InterfacePluginAnswerValues;

    /**
     * {@inheritDoc AbstractScaffold}
     */
    public static initializeScaffolding = async (): Promise<void> => {
        try {
            // Bail early
            await PathUtils.checkForWordPressInstall();

            // Check for debug mode values
            this.isDebugFullMode = await DebugUtils.isDebugFullMode();

            // Get our answers
            const answers: InterfacePluginAnswers | void = await InquirerCli.performPromptsTasks(await getPluginOptions()).catch((err) => console.error(err));

            // Start the scaffolding process
            await this.scaffoldFiles(answers);

        } catch (err: any) {
            console.log('ScaffoldTheme.performScaffolding()');
            console.error(err);
        }
    };

    /**
     * {@inheritDoc AbstractScaffold}
     */
    protected static scaffoldFiles = async (answers: InterfacePluginAnswers | any): Promise<void> => {
        try {
            // Build the values we need
            this.pluginValues = await this.buildValueObject(answers);

            if (this.isDebugFullMode) {
                console.log(this.pluginValues);
            }

            // Validate we aren't overwriting another plugin with the same name
            await PathUtils.validateIsPathWithDisplay(this.pluginValues.finalPath, 'There is already a plugin with that name. Please use another name.', true);

            // Update the internal JSON files
            let pluginConfig = await this.updateProjectConfig(this.pluginValues);

            // Update the individual files we need to scaffold
            await this.performScaffold(this.pluginValues, pluginConfig);

            await MessagingUtils.displayEndingMessages(this.pluginValues, this.composerAlreadyExists, this.packageAlreadyExists);

        } catch (err: any) {
            console.log('ScaffoldTheme.scaffoldFiles()');
            console.error(err);
        }
    };

    /**
     * @description Build an object of our needed values for scaffolding the plugin
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     * @todo refactor into Abstract class method in theme and project
     *
     * @param {InterfacePluginAnswers | any} answers
     * @return {Promise<InterfacePluginAnswerValues | any>}
     */
    private static buildValueObject = async (answers: InterfacePluginAnswers | any): Promise<InterfacePluginAnswerValues | any> => {
        try {
            // Absolute path of the themes folder
            const pluginsPath: string | undefined = await PathUtils.getPluginsFolderPath();

            // User inputs
            const projectName: string = answers.projectName ? answers.projectName : '';
            const name: string =  answers.name ? answers.name.trim() : '';
            const description: string = answers.description ? answers.description.trim() : '';
            const frontEndFramework: string = answers.frontEndFramework ? answers.frontEndFramework : '';
            const siteUrl: string = answers.siteUrl;
            const devSiteUrl: string = answers.devSiteUrl;

            // Make folder "safe" if there are spaces
            const safeName: string = await StringUtils.addDashesToString(name);

            // Create the finalized path for the scaffolded theme
            const finalPluginPath: string = `${pluginsPath}/${safeName}`;

            // Create our string modification
            const capAndSnakeCasePlugin: string = await StringUtils.capAndSnakeCaseString(safeName);

            const pluginNamespace: string =  await StringUtils.pascalCaseString(safeName);

            return {
                type: 'plugin',
                projectName: projectName,
                name: name,
                safeName: safeName,
                pluginsPath: pluginsPath,
                finalPath: finalPluginPath,
                description: description,
                frontEndFramework: frontEndFramework,
                siteUrl: siteUrl,
                devSiteUrl: devSiteUrl,
                capAndSnakeCasePlugin: capAndSnakeCasePlugin,
                namespace: pluginNamespace,
            };

        } catch (err: any) {
            console.log('ScaffoldTheme.buildValueObject()');
            console.error(err);
        }
    };

    /**
     * @description Update our project config object based on user inputs
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     * @todo refactor into Abstract class method in theme and project
     *
     * @param {InterfacePluginAnswerValues} pluginValues
     * @return {Promise<InterfacePluginConfig | any>}
     */
    private static updateProjectConfig = async (pluginValues: InterfacePluginAnswerValues): Promise<InterfacePluginConfig | any> => {
        try {
            let {
                projectName,
                name,
                finalPath,
                description,
                frontEndFramework,
            } = pluginValues;

            let configUpdates: InterfacePluginConfig = {
                'plugin-name': name,
                'plugin-path': finalPath,
                'plugin-description': description,
                'plugin-front-end-framework': frontEndFramework,
            };

            if (projectName && typeof projectName !== 'undefined') {
                configUpdates['project-name'] = projectName;
                configUpdates['project-namespace'] = await StringUtils.pascalCaseString(projectName);
            }

            // Update our config before we scaffold plugin, so we can use it in our scaffold functions
            configUpdates = await ProjectJson.update(configUpdates, 'plugin');

            return configUpdates;

        } catch (err: any) {
            console.log('ScaffoldPlugin.updateProjectConfig()');
            console.error(err);
        }
    };

    /**
     * @description
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     * @todo refactor into Abstract class method in theme and project
     *
     * @param {InterfacePluginAnswerValues} pluginValues
     * @param {InterfacePluginConfig} pluginConfig
     * @return {Promise<void>}
     */
    private static performScaffold = async (pluginValues: InterfacePluginAnswerValues, pluginConfig: InterfacePluginConfig): Promise<void> => {
        try {
            const updateObjectsArray: Array<InterfaceScaffoldJsonUpdates> = await this.buildUpdateObjectArray(pluginValues);

            const foldersToCopy: Array<InterfaceScaffoldCopyFolders> = await this.buildFoldersToCopy(pluginValues);

            await UpdateTypeFiles.copyFiles(foldersToCopy);

            await UpdateTypeFiles.updateFiles(pluginValues, updateObjectsArray);

            await UpdateTypeFiles.updateClassFiles(pluginValues);

            await UpdateTypeFiles.updateWebpack(pluginValues, 'plugin');

        } catch (err: any) {
            console.log('ScaffoldPlugin.performScaffold()');
            console.error(err);
        }
    };

    /**
     * @description
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {InterfacePluginAnswerValues} pluginValues
     * @return {Promise<Array<InterfaceScaffoldCopyFolders> | any>}
     */
    private static buildFoldersToCopy = async (pluginValues: InterfacePluginAnswerValues): Promise<Array<InterfaceScaffoldCopyFolders> | any> => {
        try {

            const foldersToCopy: Array<InterfaceScaffoldCopyFolders> = [
                {
                    source: 'scaffolding/plugin',
                    destination: `${pluginValues.finalPath}`,
                },
                {
                    source: 'scaffolding/common/classes',
                    destination: `${pluginValues.finalPath}/classes`,
                },
                {
                    source: `scaffolding/common/front-end-scaffolding/${pluginValues.frontEndFramework?.toLowerCase()}/js`,
                    destination: `${pluginValues.finalPath}/src/js`,
                },
                {
                    source: `scaffolding/common/front-end-scaffolding/${pluginValues.frontEndFramework?.toLowerCase()}/scss`,
                    destination: `${pluginValues.finalPath}/src/scss`,
                },
                {
                    source: `scaffolding/common/front-end-scaffolding/${pluginValues.frontEndFramework?.toLowerCase()}/project-root`,
                    destination: `${pluginValues.finalPath}`,
                },
                {
                    source: 'scaffolding/common/project-root',
                    destination: `${pluginValues.finalPath}`,
                },
            ];

            return foldersToCopy;

        } catch (err: any) {
            console.log('ScaffoldPlugin.buildFoldersToCopy()');
            console.error(err);
        }
    };

    /**
     * @description
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {InterfacePluginAnswerValues} pluginValues
     * @return {Promise<Array<InterfaceScaffoldJsonUpdates> | any>}
     */
    private static buildUpdateObjectArray = async (pluginValues: InterfacePluginAnswerValues): Promise<Array<InterfaceScaffoldJsonUpdates> | any> => {
        try {

            const updateObjectsArray: Array<InterfaceScaffoldJsonUpdates> = [
                {
                    fileName: 'plugin-name.php',
                    stringToUpdate: 'SCAFFOLD_NAME',
                    updateString: pluginValues.name,
                },
                {
                    fileName: 'plugin-name.php',
                    stringToUpdate: 'SCAFFOLD_DESCRIPTION',
                    updateString: pluginValues.description,
                },
                {
                    fileName: 'plugin-name.php',
                    stringToUpdate: 'SCAFFOLD_DESCRIPTION',
                    updateString: pluginValues.description,
                },
                {
                    fileName: 'plugin-name.php',
                    stringToUpdate: 'CAPS_AND_SNAKE_NAME',
                    updateString: pluginValues.capAndSnakeCasePlugin,
                },
                {
                    fileName: 'webpack.config.js',
                    stringToUpdate: 'SCAFFOLD_NAME',
                    updateString: pluginValues.name,
                },
                {
                    fileName: 'classes/BootstrapClasses.php',
                    stringToUpdate: 'CAPS_AND_SNAKE_NAME',
                    updateString: pluginValues.capAndSnakeCasePlugin,
                },
            ];

            // Perform composer updates
            const composerObjects: Array<InterfaceScaffoldJsonUpdates> | any = await CreateObjectArrays.readComposerObjects(pluginValues, this.composerAlreadyExists);

            if (!this.composerAlreadyExists) {
                updateObjectsArray.push(...composerObjects);
            }

            // Perform package.json updates
            const packageObjects: Array<InterfaceScaffoldJsonUpdates> | any = await CreateObjectArrays.readPackageObjects(pluginValues, this.packageAlreadyExists);

            if (!this.packageAlreadyExists) {
                updateObjectsArray.push(...packageObjects);
            }

            return updateObjectsArray;

        } catch (err: any) {
            console.log('ScaffoldPlugin.buildUpdateObjectArray()');
            console.error(err);
        }
    };
}

ScaffoldPlugin.initializeScaffolding().catch(err => console.error(err));

