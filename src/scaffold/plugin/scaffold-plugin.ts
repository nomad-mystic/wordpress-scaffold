import PluginAnswerValues from '../../interfaces/plugin/interface-plugin-answer-values.js';

import fs from "fs";
import colors from "colors";
import fse from "fs-extra";
import path from "path";

import {packageRootDir} from "../../utils/package-root.js";
import ScaffoldJsonUpdates from "../../interfaces/common/interface-scaffold-json-updates.js";
import {updateScaffoldFile} from "../common/update-scaffold-file.js";

const scaffoldPlugin = async (values: PluginAnswerValues): Promise<void> => {
    try {
        let {
            pluginName,
            pluginsPath,
            newPluginPath,
            pluginDescription,
            pluginFrontEndFramework,
            safePluginName,
            capAndSnakeCasePlugin,
        } = values;

        const newPluginPathString: string = newPluginPath ? newPluginPath : '';

        // Bail early
        if (fs.existsSync(newPluginPathString)) {
            console.log(colors.red('There is already a theme with that name. Please use another name.'));

            process.exit(0);
        }

        // Copy our files over to the themes folder
        fse.copySync(`${path.join(`${packageRootDir}/scaffolding/plugin`)}`, newPluginPathString, { overwrite: false });

        // Copy our files over the JS files into the theme
        fse.copySync(`${path.join(`${packageRootDir}/scaffolding/plugin-root/front-end-scaffolding/${pluginFrontEndFramework?.toLowerCase()}/js`)}`,
            `${newPluginPathString}/src/js`,
            {
                overwrite: false
            }
        );

        // Copy our files over the plugin root files into the theme
        fse.copySync(`${path.join(`${packageRootDir}/scaffolding/plugin-root/front-end-scaffolding/${pluginFrontEndFramework?.toLowerCase()}/plugin-root`)}`,
            newPluginPathString,
            {
                overwrite: false
            }
        );

        // Our updates
        const updateObjectsArray: Array<ScaffoldJsonUpdates> = [
            {
                fileName: 'functions.php',
                stringToUpdate: 'THEME_NAME',
                updateString: capAndSnakeCasePlugin,
            },
            {
                fileName: 'style.css',
                stringToUpdate: 'THEME_VALUE',
                updateString: safePluginName,
            },
            {
                fileName: 'style.css',
                stringToUpdate: 'THEME_NAME',
                updateString: pluginName,
            },
            {
                fileName: 'style.css',
                stringToUpdate: 'THEME_DESCRIPTION',
                updateString: pluginDescription,
            },
        ];

        // Update our files based on object properties
        for (let update: number = 0; update < updateObjectsArray.length; update++) {
            if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {

                updateScaffoldFile(
                    newPluginPathString,
                    updateObjectsArray[update].fileName,
                    updateObjectsArray[update].stringToUpdate,
                    updateObjectsArray[update].updateString,
                );
            }
        }

    } catch (err: any) {
        console.log('scaffoldPlugin()');
        console.log(err);
    }
};

export default scaffoldPlugin;
