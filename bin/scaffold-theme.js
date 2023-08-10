#! /usr/bin/env node
import 'dotenv/config';
import colors from 'colors';
import InquirerCli from '../src/cli/inquirer-cli.js';
import AbstractScaffold from '../src/abstract/AbstractScaffold.js';
import PathUtils from '../src/utils/path-utils.js';
import DebugUtils from '../src/utils/debug-utils.js';
import StringUtils from '../src/utils/string-utils.js';
import updateScaffoldJson from '../src/scaffold/common/update-scaffold-json.js';
import getThemeOptions from '../src/config/theme-options.js';
import scaffoldTheme from '../src/scaffold/theme/scaffold-theme.js';
class ScaffoldTheme extends AbstractScaffold {
    static isDebugFullMode = false;
    static whereAmI = '';
    static performScaffolding = async () => {
        try {
            this.whereAmI = await PathUtils.whereAmI();
            this.isDebugFullMode = await DebugUtils.isDebugFullMode();
            await this.checkForWordPressInstall();
            const answers = await InquirerCli.performPromptsTasks(await getThemeOptions()).catch((err) => console.error(err));
            console.log(answers);
            await this.scaffoldFiles(answers);
        }
        catch (err) {
            console.log('performScaffolding()');
            console.error(err);
        }
    };
    static checkForWordPressInstall = async () => {
        try {
            const isDebugMode = await DebugUtils.isDebugMode();
            const isInstalled = await PathUtils.isWordpressInstall();
            if (!isInstalled && !isDebugMode) {
                console.log(colors.yellow('Your path is not at the root of your WordPress install.'));
                console.log(colors.yellow(`You are located at ${this.whereAmI}`));
                console.log(colors.yellow('Please move to the root WordPress install folder.'));
                process.exit(1);
            }
        }
        catch (err) {
            console.log('checkForWordPressInstall()');
            console.error(err);
        }
    };
    static scaffoldFiles = async (answers) => {
        try {
            const themeValues = await this.buildValueObject(answers);
            await this.scaffoldTheme(themeValues);
            await this.scaffoldThemeRoot(themeValues);
            await this.updateScaffoldClasses(themeValues);
            console.log(colors.green(`Your ${themeValues.themeName} theme has been scaffold.`));
            console.log(colors.yellow(`Check: ${themeValues.themesPath}/${themeValues.safeThemeName}`));
        }
        catch (err) {
            console.log('scaffoldFiles()');
            console.error(err);
        }
    };
    static buildValueObject = async (answers) => {
        try {
            const configFilePath = `${this.whereAmI}/internal/project/project-config.json`;
            const themesPath = await PathUtils.getThemesFolderPath();
            const projectName = answers.projectName ? answers.projectName : '';
            const themeName = answers.themeName ? answers.themeName.trim() : '';
            const themeDescription = answers.themeDescription ? answers.themeDescription.trim() : '';
            const frontEndFramework = answers.frontEndFramework ? answers.frontEndFramework : '';
            const siteUrl = answers.siteUrl ? answers.siteUrl : '';
            const devSiteUrl = answers.devSiteUrl ? answers.devSiteUrl : '';
            const safeThemeName = await StringUtils.addDashesToString(themeName);
            const newThemePath = `${themesPath}/${safeThemeName}`;
            const capAndSnakeCaseTheme = await StringUtils.capAndSnakeCaseString(safeThemeName);
            let configUpdates = {
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
            await updateScaffoldJson(configFilePath, configUpdates);
            return {
                projectName: projectName,
                themeName: themeName,
                themesPath: themesPath,
                newThemePath: newThemePath,
                themeDescription: themeDescription,
                frontEndFramework: frontEndFramework,
                siteUrl: siteUrl,
                devSiteUrl: devSiteUrl,
                safeThemeName: safeThemeName,
                capAndSnakeCaseTheme: capAndSnakeCaseTheme,
            };
        }
        catch (err) {
            console.log('buildValueObject()');
            console.error(err);
        }
    };
    static scaffoldTheme = async (themeValues) => {
        try {
            await scaffoldTheme(themeValues);
        }
        catch (err) {
            console.log('scaffoldTheme()');
            console.error(err);
        }
    };
    static scaffoldThemeRoot = async (themeValues) => {
        try {
        }
        catch (err) {
            console.log('scaffoldThemeRoot()');
            console.error(err);
        }
    };
    static updateScaffoldClasses = async (themeValues) => {
        try {
        }
        catch (err) {
            console.log('updateScaffoldClasses()');
            console.error(err);
        }
    };
}
ScaffoldTheme.performScaffolding().catch(err => console.error(err));
