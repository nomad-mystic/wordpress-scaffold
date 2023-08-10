#! /usr/bin/env node

// Community modules
import 'dotenv/config';

import inquirer from 'inquirer';
import colors from 'colors';

// Package modules
import themeOptions from '../src/config/theme-options.js';

// import scaffoldTheme from '../src/scaffold/theme/scaffold-theme.js';
// import scaffoldThemeRoot from '../src/scaffold/theme/scaffold-root.js';
// import updateScaffoldClasses from '../src/scaffold/theme/scaffold-classes.js';
import updateScaffoldJson from '../src/scaffold/common/update-scaffold-json.js';

// Utils
import DebugUtils from '../src/utils/debug-utils.js';
import PathUtils from '../src/utils/path-utils.js';

// { whereAmI, isWordpressInstall, getThemesFolderPath }

import StringUtils from '../src/utils/string-utils.js';

// { addDashesToString, capAndSnakeCaseString, pascalCaseString }

// Interfaces
import ThemeAnswers from '../src/interfaces/theme/interface-theme-answers.js';

import InquirerCli from '../src/cli/inquirer-cli.js';
import getThemeOptions from '../src/config/theme-options.js';

import AbstractScaffold from '../src/abstract/AbstractScaffold.js';

/**
 * @classdesc
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
    public static performScaffolding = async (): Promise<void> => {
        try {
            // Gather our location
            this.whereAmI = await PathUtils.whereAmI();

            // Enable debug mode?
            this.isDebugFullMode = await DebugUtils.isDebugFullMode();

            // Bail early
            await this.checkForWordPressInstall();

            const answers: ThemeAnswers | void = await InquirerCli.performPromptsTasks(await getThemeOptions()).catch((err) => console.error(err));

            console.log(answers);

            const config = await this.scaffoldFiles(answers);




        } catch (err: any) {

            console.error(err);

        }
    };

    /**
     * @description Make sure we have a WordPress install at this root folder
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<void>
     */
    private static checkForWordPressInstall  = async (): Promise<void> => {
        try {
            // Enable debug mode?
            const isDebugMode: boolean = await DebugUtils.isDebugMode();
            const isInstalled: boolean | undefined = await PathUtils.isWordpressInstall();

            // Let the user know they need to be in the root of the project and bail early
            if (!isInstalled && !isDebugMode) {

                console.log(colors.yellow('Your path is not at the root of your WordPress install.'));
                console.log(colors.yellow(`You are located at ${this.whereAmI}`));
                console.log(colors.yellow('Please move to the root WordPress install folder.'));

                process.exit(1);
            }

        } catch (err) {

            console.error(err);

        }
    }

    /**
     * {@inheritDoc AbstractScaffold}
     */
    protected static scaffoldFiles = async (answers: ThemeAnswers | void): Promise<void> => {
        try {



        } catch (err) {

            console.error(err);

        }
    }
}

// // Starting point for scaffolding a theme
// inquirer
// .prompt(themeOptions)
// .then((answers) => {
//     const configFilePath = `${whereAmI()}/internal/project/project-config.json`;
//
//     // Absolute path of the themes folder
//     const themesPath = getThemesFolderPath();
//
//     // User inputs
//     const projectName = answers?.projectName;
//     const themeName = answers?.themeName.trim();
//     const themeDescription = answers?.themeDescription.trim();
//     const frontEndFramework = answers?.frontEndFramework;
//     const siteUrl = answers?.siteUrl;
//     const devSiteUrl = answers?.devSiteUrl;
//
//     // Make folder "safe" if there are spaces
//     const safeThemeName = addDashesToString(themeName);
//
//     // Create the finalized path for the scaffolded theme
//     const newThemePath = `${themesPath}/${safeThemeName}`;
//
//     // Create our string modification
//     const capAndSnakeCaseTheme = capAndSnakeCaseString(safeThemeName);
//
//     let configUpdates = {
//         'active-theme': safeThemeName,
//         'active-theme-path': newThemePath,
//         'absolute-project-folder': whereAmI(),
//         'absolute-themes-folder': themesPath,
//         'theme-description': themeDescription,
//         'front-end-framework': frontEndFramework,
//         'site-url': siteUrl,
//         'dev-site-url': devSiteUrl,
//     };
//
//     if (projectName && typeof projectName !== 'undefined') {
//         configUpdates['project-name'] = projectName;
//         configUpdates['project-namespace'] = pascalCaseString(projectName);
//     }
//
//     // // Update our config before we scaffold theme, so we can use it in our scaffold functions
//     const projectConfig = updateScaffoldJson(configFilePath, configUpdates);
//
//     // Build the theme
//     scaffoldTheme(answers, {
//         themeName,
//         themesPath,
//         newThemePath,
//         themeDescription,
//         frontEndFramework,
//         safeThemeName,
//         capAndSnakeCaseTheme,
//     });
//
//     scaffoldThemeRoot(answers, {
//         themeName,
//         themesPath,
//         newThemePath,
//         themeDescription,
//         frontEndFramework,
//         safeThemeName,
//         capAndSnakeCaseTheme,
//         projectName: projectConfig['project-name'],
//         projectNamespace: projectConfig['project-namespace'],
//     });
//
//     updateScaffoldClasses(answers, {
//         themeName,
//         themesPath,
//         newThemePath,
//         themeDescription,
//         frontEndFramework,
//         safeThemeName,
//         capAndSnakeCaseTheme,
//         projectName: projectConfig['project-name'],
//         projectNamespace: projectConfig['project-namespace'],
//     });
//
//     // Let the user know it has been created
//     console.log(colors.green(`Your ${themeName} theme has been scaffold.`));
//     console.log(colors.yellow(`Check: ${themesPath}/${safeThemeName}`));
// })
// .catch((error) => {
//     if (error.isTtyError) {
//
//         console.error('Prompt couldn\'t be rendered in the current environment.');
//
//     } else {
//         console.log(colors.red('Something else went wrong!'));
//
//         console.error(error);
//     }
// });

new ScaffoldTheme();
ScaffoldTheme.performScaffolding().catch(err => console.error(err));
