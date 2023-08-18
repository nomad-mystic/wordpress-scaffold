#!/usr/bin/env node

// Community modules
import 'dotenv/config';
import colors from 'colors';

// Package modules
// Classes
import InquirerCli from '../cli/inquirer-cli.js';
import AbstractScaffold from '../abstract/AbstractScaffold.js';

// Utils
import PathUtils from '../utils/path-utils.js';
import DebugUtils from '../utils/debug-utils.js';
import StringUtils from '../utils/string-utils.js';

// Interfaces
import PluginAnswers from '../interfaces/plugin/interface-plugin-anwsers.js';

// Functions
import getPluginOptions from '../config/plugin-options.js';

import scaffoldPlugin from "../scaffold/plugin/scaffold-plugin.js";

import updateScaffoldJson, { ProjectJson } from '../scaffold/common/update-scaffold-json.js';

import PluginAnswerValues from "../interfaces/plugin/interface-plugin-answer-values.js";
import PluginConfig from "../interfaces/plugin/interface-plugin-config.js";

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
    public static performScaffolding = async (): Promise<void> => {
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
            const pluginValues: PluginAnswerValues  = await this.buildValueObject(answers);

            let config = await this.updateProjectConfig(pluginValues);

            // await scaffoldPlugin(pluginValues);

            // Let the user know it has been created
            console.log(colors.green(`Your ${answers.pluginName} plugin has been scaffold.`));
            console.log(colors.yellow(`Check: ${answers.pluginPath}/${answers.safePluginName}`));

        } catch (err: any) {
            console.log('ScaffoldTheme.scaffoldFiles()');
            console.error(err);
        }
    };

    /**
     * @description Build an object of our needed values for scaffolding the plugin
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
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
            const newPluginPath: string = `${pluginsPath}/${safePluginName}`;

            // Create our string modification
            const capAndSnakeCasePlugin: string = await StringUtils.capAndSnakeCaseString(safePluginName);

            return {
                projectName: projectName,
                pluginName: pluginName,
                pluginsPath: pluginsPath,
                newPluginPath: newPluginPath,
                pluginDescription: pluginDescription,
                pluginFrontEndFramework: pluginFrontEndFramework,
                siteUrl: siteUrl,
                devSiteUrl: devSiteUrl,
                safePluginName: safePluginName,
                capAndSnakeCasePlugin: capAndSnakeCasePlugin,
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
     *
     * @return {Promise<PluginConfig | any>}
     */
    private static updateProjectConfig = async (pluginValues: PluginAnswerValues): Promise<PluginConfig | any> => {
        try {
            let {
                projectName,
                pluginName,
                newPluginPath,
                pluginDescription,
                pluginFrontEndFramework,
            } = pluginValues;

            let configUpdates: PluginConfig = {
                'plugin-name': pluginName,
                'plugin-path': newPluginPath,
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
    }
}

ScaffoldPlugin.performScaffolding().catch(err => console.error(err));

