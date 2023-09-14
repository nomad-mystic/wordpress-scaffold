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
import ThemeConfig from '../interfaces/theme/interface-theme-config.js';
import ThemeAnswerValues from '../interfaces/theme/interface-theme-answer-values.js';

// Functions
import updateInternalJson, {ProjectJson} from '../scaffold/common/update-internal-json.js';
import getThemeOptions from '../config/theme-options.js';
import scaffoldTheme from '../scaffold/theme/scaffold-theme.js';
import scaffoldThemeRoot from '../scaffold/theme/scaffold-root.js';
import updateScaffoldClasses from '../scaffold/theme/scaffold-classes.js';
import PluginAnswerValues from "../interfaces/plugin/interface-plugin-answer-values.js";
import PluginConfig from "../interfaces/plugin/interface-plugin-config.js";
import MessagingUtils from "../utils/messaging-utils.js";
import ScaffoldJsonUpdates from "../interfaces/common/interface-scaffold-json-updates.js";
import ScaffoldCopyFolders from "../interfaces/common/interface-scaffold-copy-folders.js";
import UpdateTypeFiles from "../scaffold/common/update-type-files.js";

/**
 * @classdesc Scaffold a new theme based on user's inputs
 * @class ScaffoldTheme
 * @extends AbstractScaffold
 * @author Keith Murphy | nomadmystics@gmail.com
 */
class ScaffoldTheme extends AbstractScaffold {
    private static isDebugFullMode: boolean = false;
    private static whereAmI: string = '';

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
     * @type ThemeAnswerValues
     * @private
     */
    private static themeValues: ThemeAnswerValues;

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

            const answers: ThemeAnswers | void = await InquirerCli.performPromptsTasks(await getThemeOptions()).catch((err) => console.error(err));

            await this.scaffoldFiles(answers);

        } catch (err: any) {
            console.log('ScaffoldTheme.performScaffolding()');
            console.error(err);
        }
    };

    /**
     * {@inheritDoc AbstractScaffold}
     */
    protected static scaffoldFiles = async (answers: ThemeAnswers | any): Promise<void> => {
        try {
            this.themeValues = await this.buildValueObject(answers);

            if (this.isDebugFullMode) {
                console.log(this.themeValues);
            }

            // Update the internal JSON files
            let themeConfig = await this.updateProjectConfig(this.themeValues);



            // Build the theme
            // await this.scaffoldTheme(this.themeValues);
            //
            // await this.scaffoldThemeRoot(this.themeValues);
            //
            // await this.updateScaffoldClasses(this.themeValues);

            // Update the individual files we need to scaffold
            await this.performScaffold(this.themeValues, themeConfig);

            await MessagingUtils.displayEndingMessages(this.themeValues, this.composerAlreadyExists, this.packageAlreadyExists);

            // Let the user know it has been created
            console.log(colors.green(`Your ${this.themeValues.name} theme has been scaffold.`));
            console.log(colors.yellow(`Check: ${this.themeValues.themesPath}/${this.themeValues.safeName}`));

        } catch (err: any) {
            console.log('ScaffoldTheme.scaffoldFiles()');
            console.error(err);
        }
    }

    /**
     * @description Build our object of values from the user's answers
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {ThemeAnswers | any} answers
     * @return {Promise<ThemeAnswerValues | any>}
     */
    private static buildValueObject = async (answers: ThemeAnswers | any): Promise<ThemeAnswerValues | any> => {
        try {

            // Absolute path of the themes folder
            const themesPath: string | undefined = await PathUtils.getThemesFolderPath();

            // User inputs
            const projectName: string = answers.projectName ? answers.projectName : '';
            const themeName: string =  answers.themeName ? answers.themeName.trim() : '';
            const themeDescription: string = answers.themeDescription ? answers.themeDescription.trim() : '';
            const frontEndFramework: string = answers.frontEndFramework ? answers.frontEndFramework : '';
            const siteUrl: string = answers.siteUrl ? answers.siteUrl : '';
            const devSiteUrl: string = answers.devSiteUrl ? answers.devSiteUrl : '';

            // Make folder "safe" if there are spaces
            const safeName: string = await StringUtils.addDashesToString(themeName);

            // Create the finalized path for the scaffolded theme
            const finalThemePath: string = `${themesPath}/${safeName}`;

            // Create our string modification
            const capAndSnakeCaseTheme: string = await StringUtils.capAndSnakeCaseString(safeName);

            const themeNamespace: string =  await StringUtils.pascalCaseString(safeName);

            return {
                type: 'theme',
                name: themeName,
                safeName: safeName,
                themesPath: themesPath,
                finalPath: finalThemePath,
                description: themeDescription,
                frontEndFramework: frontEndFramework,
                siteUrl: siteUrl,
                devSiteUrl: devSiteUrl,
                capAndSnakeCaseTheme: capAndSnakeCaseTheme,
                namespace: themeNamespace,
            };

        } catch (err: any) {
            console.log('ScaffoldTheme.buildValueObject()');
            console.error(err);
        }
    };


    private static updateProjectConfig = async (themeValues: ThemeAnswerValues): Promise<ThemeConfig | any> => {
        let {
            projectName,
            name,
            safeName,
            themesPath,
            finalPath,
            description,
            frontEndFramework,
            siteUrl,
            devSiteUrl
        } = themeValues;

        let configUpdates: ThemeConfig = {
            'active-theme': safeName,
            'active-theme-path': finalPath,
            'absolute-project-folder': this.whereAmI,
            'absolute-themes-folder': themesPath,
            'theme-description': description,
            'front-end-framework': frontEndFramework,
            'site-url': siteUrl,
            'dev-site-url': devSiteUrl,
        };

        if (projectName && typeof projectName !== 'undefined') {
            configUpdates['project-name'] = projectName;
            configUpdates['project-namespace'] = await StringUtils.pascalCaseString(projectName);
        }

        // Update our config before we scaffold plugin, so we can use it in our scaffold functions
        configUpdates = await ProjectJson.update(configUpdates, 'theme');

        return configUpdates;
    };

    /**
     * @description
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     * @todo refactor into Abstract class method in theme and project
     *
     * @param {ThemeAnswerValues} themeValues
     * @param {ThemeConfig} themeConfig
     * @return {Promise<void>}
     */
    private static performScaffold = async (themeValues: ThemeAnswerValues, themeConfig: ThemeConfig): Promise<void> => {
        try {
            const updateObjectsArray: Array<ScaffoldJsonUpdates> = await this.buildUpdateObjectArray(themeValues);

            const foldersToCopy: Array<ScaffoldCopyFolders> = await this.buildFoldersToCopy(themeValues);

            await UpdateTypeFiles.copyFiles(foldersToCopy);

            await UpdateTypeFiles.updateFiles(themeValues, updateObjectsArray);

            await UpdateTypeFiles.updateClassFiles(themeValues);

            await UpdateTypeFiles.updateWebpack(themeValues, 'theme');

        } catch (err: any) {
            console.log('ScaffoldPlugin.performScaffold()');
            console.error(err);
        }
    };

    private static buildFoldersToCopy = async (themeValues: ThemeAnswerValues): Promise<Array<ScaffoldCopyFolders> | any> => {
        try {

            const foldersToCopy: Array<ScaffoldCopyFolders> = [
                {
                    source: 'scaffolding/plugin',
                    destination: `${pluginValues.finalPath}`,
                },
                {
                    source: 'scaffolding/common/classes',
                    destination: `${themeValues.finalPath}/classes`,
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


        } catch (err: any) {
            console.log('ScaffoldTheme.buildFoldersToCopy()');
            console.error(err);
        }
    }


    /**
     * @description Based on a user's answers build our theme files
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {ThemeAnswerValues} themeValues
     * @return Promise<void>
     */
    private static scaffoldTheme = async (themeValues: ThemeAnswerValues): Promise<void> => {
        try {

            await scaffoldTheme(themeValues);

        } catch (err: any) {
            console.log('ScaffoldTheme.scaffoldTheme()');
            console.error(err);
        }
    }

    /**
     * @description Based on a user's answers build our theme root
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {ThemeAnswerValues} themeValues
     * @return Promise<void>
     */
    private static scaffoldThemeRoot = async (themeValues: ThemeAnswerValues): Promise<void> => {
        try {

            await scaffoldThemeRoot(themeValues);

        } catch (err: any) {
            console.log('ScaffoldTheme.scaffoldThemeRoot()');
            console.error(err);
        }
    }

    /**
     * @description Based on a user's answers build our theme classes
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {ThemeAnswerValues} themeValues
     * @return Promise<void>
     */
    private static updateScaffoldClasses = async (themeValues: ThemeAnswerValues): Promise<void> => {
        try {

            await updateScaffoldClasses(themeValues);

        } catch (err: any) {
            console.log('ScaffoldTheme.updateScaffoldClasses()');
            console.error(err);
        }
    }
}

ScaffoldTheme.initializeScaffolding().catch(err => console.error(err));
