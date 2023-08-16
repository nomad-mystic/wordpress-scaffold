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
import ThemeAnswers from '../interfaces/theme/interface-theme-answers.js';
import ThemeAnswerValues from '../interfaces/theme/interface-theme-answer-values.js';
import PluginAnswers from '../interfaces/plugin/interface-plugin-anwsers.js';

// Functions
import getPluginOptions from '../config/plugin-options.js';
// import updateScaffoldJson from '../scaffold/common/update-scaffold-json.js';
// import scaffoldPlugin from '../scaffold/plugin/scaffold-plugin.js';
// import scaffoldThemeRoot from '../scaffold/theme/scaffold-root.js';
// import updateScaffoldClasses from '../scaffold/theme/scaffold-classes.js';

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
            console.log(answers);

            // const pluginValues: ThemeAnswerValues  = await this.buildValueObject(answers);
            //
            // // Build the theme
            // await this.scaffoldPlugin(pluginValues);
            //
            // // Let the user know it has been created
            // console.log(colors.green(`Your ${pluginValues.pluginName} theme has been scaffold.`));
            // console.log(colors.yellow(`Check: ${pluginValues.pluginPath}/${pluginValues.safePluginName}`));

        } catch (err: any) {
            console.log('ScaffoldTheme.scaffoldFiles()');
            console.error(err);
        }
    }



    /**
     * @description Based on a user's answers build our theme files
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {ThemeAnswerValues} pluginValues
     * @return Promise<void>
     */
    private static scaffoldPlugin = async (pluginValues: ThemeAnswerValues): Promise<void> => {
        try {

            // await scaffoldTheme(pluginValues);

        } catch (err: any) {
            console.log('ScaffoldTheme.scaffoldTheme()');
            console.error(err);
        }
    }
}

ScaffoldPlugin.performScaffolding().catch(err => console.error(err));

