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
import updateScaffoldJson from '../scaffold/common/update-scaffold-json.js';
import getThemeOptions from '../config/theme-options.js';
import scaffoldTheme from '../scaffold/theme/scaffold-theme.js';
import scaffoldThemeRoot from '../scaffold/theme/scaffold-root.js';
import updateScaffoldClasses from '../scaffold/theme/scaffold-classes.js';

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
            const themeValues: ThemeAnswerValues  = await this.buildValueObject(answers);

            // Build the theme
            await this.scaffoldTheme(themeValues);

            await this.scaffoldThemeRoot(themeValues);

            await this.updateScaffoldClasses(themeValues);

            // Let the user know it has been created
            console.log(colors.green(`Your ${themeValues.themeName} theme has been scaffold.`));
            console.log(colors.yellow(`Check: ${themeValues.themesPath}/${themeValues.safeThemeName}`));

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
            const configFilePath: string = `${this.whereAmI}/internal/project/project-config.json`;

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
            const safeThemeName: string = await StringUtils.addDashesToString(themeName);

            // Create the finalized path for the scaffolded theme
            const newThemePath: string = `${themesPath}/${safeThemeName}`;

            // Create our string modification
            const capAndSnakeCaseTheme: string = await StringUtils.capAndSnakeCaseString(safeThemeName);

            let configUpdates: ThemeConfig = {
                'active-theme': safeThemeName,
                'active-theme-path': newThemePath,
                'absolute-project-folder': this.whereAmI,
                'absolute-themes-folder': themesPath,
                'theme-description': themeDescription,
                'front-end-framework': frontEndFramework,
                'site-url': siteUrl,
                'dev-site-url': devSiteUrl,
            };

            if (projectName && typeof projectName !== 'undefined') {
                configUpdates['project-name'] = projectName;
                configUpdates['project-namespace'] = await StringUtils.pascalCaseString(projectName);
            }

            // // Update our config before we scaffold theme, so we can use it in our scaffold functions
            configUpdates = await updateScaffoldJson(configFilePath, configUpdates);

            return {
                projectName: configUpdates['project-name'],
                themeName: themeName,
                themesPath: themesPath,
                newThemePath: newThemePath,
                themeDescription: themeDescription,
                frontEndFramework: frontEndFramework,
                siteUrl: siteUrl,
                devSiteUrl: devSiteUrl,
                safeThemeName: safeThemeName,
                capAndSnakeCaseTheme: capAndSnakeCaseTheme,
                projectNamespace: configUpdates['project-namespace'],
            };

        } catch (err: any) {
            console.log('ScaffoldTheme.buildValueObject()');
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
