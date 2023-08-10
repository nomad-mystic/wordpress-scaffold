import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import colors from 'colors';
import { packageRootDir } from '../../../package-root.js';
import { updateScaffoldFile } from '../common/update-scaffold-file.js';
const scaffoldTheme = async (values) => {
    try {
        let { themeName, themesPath, newThemePath, themeDescription, frontEndFramework, safeThemeName, capAndSnakeCaseTheme, } = values;
        const newThemePathString = newThemePath ? newThemePath : '';
        if (fs.existsSync(newThemePathString)) {
            console.log(colors.red('There is already a theme with that name. Please use another name.'));
            process.exit(0);
        }
        fse.copySync(`${path.join(`${packageRootDir}/scaffolding/theme`)}`, newThemePathString, { overwrite: false });
        fse.copySync(`${path.join(`${packageRootDir}/scaffolding/theme-root/front-end-scaffolding/${frontEndFramework?.toLowerCase()}/js`)}`, `${newThemePathString}/src/js`, {
            overwrite: false
        });
        fse.copySync(`${path.join(`${packageRootDir}/scaffolding/theme-root/front-end-scaffolding/${frontEndFramework?.toLowerCase()}/theme-root`)}`, newThemePathString, {
            overwrite: false
        });
        const updateObjectsArray = [
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
                updateString: themeName,
            },
            {
                fileName: 'style.css',
                stringToUpdate: 'THEME_DESCRIPTION',
                updateString: themeDescription,
            },
        ];
        for (let update = 0; update < updateObjectsArray.length; update++) {
            if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {
                updateScaffoldFile(newThemePath, updateObjectsArray[update].fileName, updateObjectsArray[update].stringToUpdate, updateObjectsArray[update].updateString);
            }
        }
    }
    catch (err) {
        console.log('scaffoldTheme()');
        console.error(err);
    }
};
export default scaffoldTheme;
