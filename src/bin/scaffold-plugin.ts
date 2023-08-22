#!/usr/bin/env node

// Community modules
import 'dotenv/config';
import colors from 'colors';

// Package modules
// Classes
import InquirerCli from '../cli/inquirer-cli.js';
import AbstractScaffold from '../abstract/AbstractScaffold.js';
import updateInternalJson, { ProjectJson } from '../scaffold/common/update-internal-json.js';

// Utils
import PathUtils from '../utils/path-utils.js';
import DebugUtils from '../utils/debug-utils.js';
import StringUtils from '../utils/string-utils.js';

// Interfaces
import PluginAnswers from '../interfaces/plugin/interface-plugin-anwsers.js';
import PluginAnswerValues from '../interfaces/plugin/interface-plugin-answer-values.js';
import PluginConfig from '../interfaces/plugin/interface-plugin-config.js';
import ScaffoldCopyFolders from '../interfaces/common/interface-scaffold-copy-folders.js';
import ScaffoldJsonUpdates from '../interfaces/common/interface-scaffold-json-updates.js';

// Functions
import getPluginOptions from '../config/plugin-options.js';
import UpdateTypeFiles from '../scaffold/common/update-type-files.js';

/**
 * @classdesc Scaffold a new theme based on user's inputs
 * @class ScaffoldTheme
 * @extends AbstractScaffold
 * @author Keith Murphy | nomadmystics@gmail.com
 */
class ScaffoldPlugin extends AbstractScaffold {
    private static isDebugFullMode: boolean = false;
    private static whereAmI: string = '';

    /**
     * {@inheritDoc AbstractScaffold}
     */
    public static initializeScaffolding = async (): Promise<void> => {
        try {
            // Gather our location
            this.whereAmI = await PathUtils.whereAmI();

            // Enable debug mode?
            this.isDebugFullMode = await DebugUtils.isDebugFullMode();

            // Bail early
            await PathUtils.checkForWordPressInstall();

            // Get our answers
            const answers: PluginAnswers | void = await InquirerCli.performPromptsTasks(await getPluginOptions()).catch((err) => console.error(err));

            await this.scaffoldFiles(answers);

        } catch (err: any) {
            console.log('ScaffoldTheme.performScaffolding()');
            console.error(err);
        }
    };

    /**
     * {@inheritDoc AbstractScaffold}
     */
    protected static scaffoldFiles = async (answers: PluginAnswers | any): Promise<void> => {
        try {
            // Build the values we need
            const pluginValues: PluginAnswerValues  = await this.buildValueObject(answers);

            // Validate we aren't overwriting another plugin with the same name
            await PathUtils.validateIsPath(pluginValues.finalPath, 'There is already a plugin with that name. Please use another name.', true);

            // Update the internal JSON files
            let pluginConfig = await this.updateProjectConfig(pluginValues);

            // Update the individual files we need to scaffold
            await this.performScaffold(pluginValues, pluginConfig);

            // Let the user know it has been created
            console.log(colors.green(`Your ${pluginValues.pluginName} plugin has been scaffold.`));
            console.log(colors.yellow(`Check: ${pluginValues.finalPath}`));

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
     * @return {Promise<PluginAnswerValues | any>}
     */
    private static buildValueObject = async (answers: PluginAnswers | any): Promise<PluginAnswerValues | any> => {
        try {
            // Absolute path of the themes folder
            const pluginsPath: string | undefined = await PathUtils.getPluginsFolderPath();

            // User inputs
            const projectName: string = answers.projectName ? answers.projectName : '';
            const pluginName: string =  answers.pluginName ? answers.pluginName.trim() : '';
            const pluginDescription: string = answers.pluginDescription ? answers.pluginDescription.trim() : '';
            const pluginFrontEndFramework: string = answers.pluginFrontEndFramework ? answers.pluginFrontEndFramework : '';
            const siteUrl: string = answers.siteUrl;
            const devSiteUrl: string = answers.devSiteUrl;

            // Make folder "safe" if there are spaces
            const safePluginName: string = await StringUtils.addDashesToString(pluginName);

            // Create the finalized path for the scaffolded theme
            const finalPluginPath: string = `${pluginsPath}/${safePluginName}`;

            // Create our string modification
            const capAndSnakeCasePlugin: string = await StringUtils.capAndSnakeCaseString(safePluginName);

            const pluginNamespace: string =  await StringUtils.pascalCaseString(safePluginName);

            return {
                projectName: projectName,
                pluginName: pluginName,
                safePluginName: safePluginName,
                pluginsPath: pluginsPath,
                finalPath: finalPluginPath,
                pluginDescription: pluginDescription,
                pluginFrontEndFramework: pluginFrontEndFramework,
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
     * @return {Promise<PluginConfig | any>}
     */
    private static updateProjectConfig = async (pluginValues: PluginAnswerValues): Promise<PluginConfig | any> => {
        try {
            let {
                projectName,
                pluginName,
                finalPath,
                pluginDescription,
                pluginFrontEndFramework,
            } = pluginValues;

            let configUpdates: PluginConfig = {
                'plugin-name': pluginName,
                'plugin-path': finalPath,
                'plugin-description': pluginDescription,
                'plugin-front-end-framework': pluginFrontEndFramework,
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
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     * @todo refactor into Abstract class method in theme and project
     *
     * @return {Promise<void>}
     */
    private static performScaffold = async (values: PluginAnswerValues, pluginConfig: PluginConfig): Promise<void> => {
        try {


            // console.log(values);
            // console.log(pluginConfig);

            // Our updates
            const updateObjectsArray: Array<ScaffoldJsonUpdates> = [
                {
                    fileName: 'composer.json',
                    stringToUpdate: 'SCAFFOLD_TYPE',
                    updateString: 'plugins',
                },
                {
                    fileName: 'composer.json',
                    stringToUpdate: 'SCAFFOLD_NAME',
                    updateString: values.safePluginName,
                },
                {
                    fileName: 'composer.json',
                    stringToUpdate: 'SCAFFOLD_DESCRIPTION',
                    updateString: values.pluginDescription,
                },
                {
                    fileName: 'package.json',
                    stringToUpdate: 'SCAFFOLD_NAME',
                    updateString: values.safePluginName,
                },
                {
                    fileName: 'package.json',
                    stringToUpdate: 'SCAFFOLD_DESCRIPTION',
                    updateString: values.pluginDescription,
                },
                {
                    fileName: 'plugin-name.php',
                    stringToUpdate: 'SCAFFOLD_NAME',
                    updateString: values.safePluginName,
                },
                {
                    fileName: 'plugin-name.php',
                    stringToUpdate: 'SCAFFOLD_DESCRIPTION',
                    updateString: values.pluginDescription,
                },
                {
                    fileName: 'plugin-name.php',
                    stringToUpdate: 'SCAFFOLD_DESCRIPTION',
                    updateString: values.pluginDescription,
                },
                {
                    fileName: 'plugin-name.php',
                    stringToUpdate: 'CAPS_AND_SNAKE_NAME',
                    updateString: values.capAndSnakeCasePlugin,
                },
            ];

            const foldersToCopy: Array<ScaffoldCopyFolders> = [
                {
                    source: 'scaffolding/plugin',
                    destination: `${values.finalPath}`,
                },
                {
                    source: 'scaffolding/common/classes',
                    destination: `${values.finalPath}/classes`,
                },
                {
                    source: `scaffolding/common/front-end-scaffolding/${values.pluginFrontEndFramework?.toLowerCase()}/js`,
                    destination: `${values.finalPath}/src/js`,
                },
                {
                    source: `scaffolding/common/front-end-scaffolding/${values.pluginFrontEndFramework?.toLowerCase()}/project-root`,
                    destination: `${values.finalPath}`,
                },
                {
                    source: 'scaffolding/common/project-root',
                    destination: `${values.finalPath}`,
                },
            ];

            await UpdateTypeFiles.copyFiles(foldersToCopy);

            await UpdateTypeFiles.updateFiles(values, updateObjectsArray);

            await UpdateTypeFiles.updateClassFiles(values);

        } catch (err: any) {
            console.log('ScaffoldPlugin.performScaffold()');
            console.error(err);
        }
    };
}

ScaffoldPlugin.initializeScaffolding().catch(err => console.error(err));

