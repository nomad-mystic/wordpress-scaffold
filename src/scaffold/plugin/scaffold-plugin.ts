import PluginAnswerValues from '../../interfaces/plugin/interface-plugin-answer-values.js';

import fs from "fs";
import colors from "colors";
import fse from "fs-extra";
import path from "path";

import {packageRootDir} from "../../utils/package-root.js";
import ScaffoldJsonUpdates from '../../interfaces/common/interface-scaffold-json-updates.js';
import {updateScaffoldFile} from "../common/update-scaffold-file.js";
import ScaffoldCopyFolders from '../../interfaces/common/interface-scaffold-copy-folders.js';


/**
    // Copy/Update
    /scaffold/plugin/**
    /scaffold/common/root/**
    /scaffold/common/classes/**
    /scaffold/common/classes/font-end-scaffolding/**
    /scaffold/common/classes/project-root/**
 */
const scaffoldPlugin = async (values: PluginAnswerValues, foldersToCopy: Array<any>): Promise<void> => {
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

        const newPluginPathString: string = values.newPluginPath ? values.newPluginPath : '';

        // Bail early
        if (fs.existsSync(newPluginPathString)) {
            console.log(colors.red('There is already a plugin with that name. Please use another name.'));

            process.exit(0);
        }

        // let copyFolder;

        for (let copyFolder of foldersToCopy) {
            console.log(copyFolder.source);
            console.log(copyFolder.destination);

            fse.copySync(`${path.join(`${packageRootDir}/${copyFolder.source}`)}`,
                copyFolder.destination,
                {
                    overwrite: false
                }
            );
        }

        // composer.json
        // SCAFFOLD_NAME
        // SCAFFOLD_TYPE
        // SCAFFOLD_DESCRIPTION
        // PASCAL_NAME



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

                // updateScaffoldFile(
                //     newPluginPathString,
                //     updateObjectsArray[update].fileName,
                //     updateObjectsArray[update].stringToUpdate,
                //     updateObjectsArray[update].updateString,
                // );
            }
        }

    } catch (err: any) {
        console.log('scaffoldPlugin()');
        console.log(err);
    }
};

export default scaffoldPlugin;
