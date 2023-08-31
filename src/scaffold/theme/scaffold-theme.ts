// Core modules
import fs from 'fs';
import path from 'path';

// Community modules
import fse from 'fs-extra';
import colors from 'colors';

// Package Modules
// Root
import { packageRootDir } from '../../utils/package-root.js';

// Functions
import { updateScaffoldFile } from '../common/update-scaffold-file.js';

// Interfaces
import ScaffoldJsonUpdates from "../../interfaces/common/interface-scaffold-json-updates.js";
import ThemeAnswerValues from "../../interfaces/theme/interface-theme-answer-values.js";

/**
 * @description Based on user input scaffold our theme
 *
 * @param {object} values
 * @param {string} values.themeName
 * @param {string} values.themesPath
 * @param {string} values.finalPath
 * @param {string} values.themeDescription
 * @param {boolean} values.addFrontEndBuildTools ?
 * @param {string} values.frontEndFramework
 * @param {string} values.safeThemeName
 * @param {string} values.capAndSnakeCaseTheme
 *
 * @return {Promise<void>}
 */
const scaffoldTheme = async (values: ThemeAnswerValues): Promise<void> => {
    try {
        let {
            name,
            themesPath,
            finalPath,
            themeDescription,
            frontEndFramework,
            safeThemeName,
            capAndSnakeCaseTheme,
        } = values;

        const newThemePathString: string = finalPath ? finalPath : '';

        // Bail early
        if (fs.existsSync(newThemePathString)) {
            console.log(colors.red('There is already a theme with that name. Please use another name.'));

            process.exit(0);
        }

        // Copy our files over to the themes folder
        fse.copySync(`${path.join(`${packageRootDir}/scaffolding/theme`)}`, newThemePathString, { overwrite: false });

        // Copy our files over the JS files into the theme
        fse.copySync(`${path.join(`${packageRootDir}/scaffolding/theme-root/front-end-scaffolding/${frontEndFramework?.toLowerCase()}/js`)}`,
            `${newThemePathString}/src/js`,
            {
                overwrite: false
            }
        );

        // Copy our files over the theme root files into the theme
        fse.copySync(`${path.join(`${packageRootDir}/scaffolding/theme-root/front-end-scaffolding/${frontEndFramework?.toLowerCase()}/theme-root`)}`,
            newThemePathString,
            {
                overwrite: false
            }
        );

        // Our updates
        const updateObjectsArray: Array<ScaffoldJsonUpdates> = [
            {
                fileName: 'functions.php',
                stringToUpdate: 'THEME_NAME',
                updateString: capAndSnakeCaseTheme,
            },
            {
                fileName: 'style.css',
                stringToUpdate: 'THEME_VALUE',
                updateString: safeThemeName,
            },
            {
                fileName: 'style.css',
                stringToUpdate: 'THEME_NAME',
                updateString: name,
            },
            {
                fileName: 'style.css',
                stringToUpdate: 'THEME_DESCRIPTION',
                updateString: themeDescription,
            },
        ];

        // Update our files based on object properties
        for (let update: number = 0; update < updateObjectsArray.length; update++) {
            if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {

                updateScaffoldFile(
                    finalPath,
                    updateObjectsArray[update].fileName,
                    updateObjectsArray[update].stringToUpdate,
                    updateObjectsArray[update].updateString,
                );
            }
        }

    } catch (err) {

        console.log('scaffoldTheme()');
        console.error(err);

    }
};

export default scaffoldTheme;

