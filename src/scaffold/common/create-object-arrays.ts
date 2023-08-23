import fse from "fs-extra";

// Package Modules
// Classes
import PathUtils from "../../utils/path-utils.js";

// Interfaces
import PluginAnswerValues from '../../interfaces/plugin/interface-plugin-answer-values.js';
import ScaffoldJsonUpdates from '../../interfaces/common/interface-scaffold-json-updates.js';
import colors from "colors";
import MessagingUtils from "../../utils/messaging-utils.js";

/**
 * @classdesc
 * @class CreateObjectArrays
 * @author Keith Murphy | nomadmystics@gmail.com
 */
export default class CreateObjectArrays {
    public static createComposerObjects = async (values: PluginAnswerValues, composerExists: boolean = false): Promise<Array<ScaffoldJsonUpdates> | any> => {
        try {

            if (composerExists) {
                await MessagingUtils.displayColoredMessage('Looks like you already have a composer.json file, so this will not be scaffolded', 'red');
                await MessagingUtils.displayColoredMessage('See documentation on how to autoload classes with psr-4', 'yellow');
                console.log("\n");

                return [];
            }

            const updateObjectsArray: Array<ScaffoldJsonUpdates> = [
                {
                    fileName: 'composer.json',
                    stringToUpdate: 'SCAFFOLD_TYPE',
                    updateString: 'plugins',
                },
                {
                    fileName: 'composer.json',
                    stringToUpdate: 'SCAFFOLD_NAME',
                    updateString: values.safeName,
                },
                {
                    fileName: 'composer.json',
                    stringToUpdate: 'SCAFFOLD_DESCRIPTION',
                    updateString: values.description,
                },
                {
                    fileName: 'composer.json',
                    stringToUpdate: 'PASCAL_NAME',
                    updateString: values.namespace,
                },
            ];

            return updateObjectsArray;

        } catch (err: any) {
            console.log('CreateObjectArrays.createComposerObjects()');
            console.error(err);
        }
    };


    public static createPackageObjects = async (values: PluginAnswerValues, packagesExists: boolean = false): Promise<Array<ScaffoldJsonUpdates> | any> => {
        try {

            if (packagesExists) {
                await MessagingUtils.displayColoredMessage('Looks like you already have a package.json file, so this will not be scaffolded', 'red');
                await MessagingUtils.displayColoredMessage('See documentation on Node.js', 'yellow');
                console.log("\n");

                return [];
            }

            const updateObjectsArray: Array<ScaffoldJsonUpdates> = [
                {
                    fileName: 'package.json',
                    stringToUpdate: 'SCAFFOLD_NAME',
                    updateString: values.safeName,
                },
                {
                    fileName: 'package.json',
                    stringToUpdate: 'SCAFFOLD_DESCRIPTION',
                    updateString: values.description,
                },
            ];

            return updateObjectsArray;

        } catch (err: any) {
            console.log('CreateObjectArrays.createPackageObjects()');
            console.error(err);
        }
    };
}
