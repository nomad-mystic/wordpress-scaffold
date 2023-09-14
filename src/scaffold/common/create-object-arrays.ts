// Package Modules
// Utils
import MessagingUtils from '../../utils/messaging-utils.js';

// Interfaces
import PluginAnswerValues from '../../interfaces/plugin/interface-plugin-answer-values.js';
import ScaffoldJsonUpdates from '../../interfaces/common/interface-scaffold-json-updates.js';
import ThemeAnswerValues from "../../interfaces/theme/interface-theme-answer-values.js";

/**
 * @classdesc
 * @class CreateObjectArrays
 * @author Keith Murphy | nomadmystics@gmail.com
 */
export default class CreateObjectArrays {
    /**
     * @description
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return {Promise<Array<ScaffoldJsonUpdates> | any>}
     */
    public static readComposerObjects = async (values: PluginAnswerValues | ThemeAnswerValues, composerAlreadyExists: boolean = false): Promise<Array<ScaffoldJsonUpdates> | any> => {
        try {

            if (composerAlreadyExists) {
                await MessagingUtils.displayColoredMessage('Looks like you already have a composer.json file, so this will not be scaffolded', 'red');
                await MessagingUtils.displayColoredMessage('See documentation on how to autoload classes with psr-4', 'yellow');
                console.log("\n");

                return [];
            }

            return await this.createComposerObjects(values);

        } catch (err: any) {
            console.log('CreateObjectArrays.readComposerObjects()');
            console.error(err);
        }
    };

    /**
     * @description
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {PluginAnswerValues} values
     * @return {Promise<Array<ScaffoldJsonUpdates> | any>}
     */
    private static createComposerObjects = async (values: PluginAnswerValues | ThemeAnswerValues): Promise<Array<ScaffoldJsonUpdates> | any> => {
        try {

            const updateObjectsArray: Array<ScaffoldJsonUpdates> = [
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
                {
                    fileName: 'composer.json',
                    stringToUpdate: 'PATH_TO_COMPOSER',
                    updateString: '', // @todo this will need to change on Theme refactor
                },
            ];

            return updateObjectsArray;

        } catch (err: any) {
            console.log('createComposerObjects()');
            console.error(err);
        }
    };

    /**
     * @description
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return {Promise<Array<ScaffoldJsonUpdates> | any>}
     */
    public static readPackageObjects = async (values: PluginAnswerValues | ThemeAnswerValues, packageAlreadyExists: boolean = false): Promise<Array<ScaffoldJsonUpdates> | any> => {
        try {

            if (packageAlreadyExists) {
                await MessagingUtils.displayColoredMessage('Looks like you already have a package.json file, so this will not be scaffolded', 'red');
                await MessagingUtils.displayColoredMessage('See documentation on Node.js', 'yellow');
                console.log("\n");

                return [];
            }

            return await this.createPackageObjects(values);

        } catch (err: any) {
            console.log('CreateObjectArrays.readPackageObjects()');
            console.error(err);
        }
    };

    /**
     * @description
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {PluginAnswerValues} values
     * @return {Promise<Array<ScaffoldJsonUpdates> | any>}
     */
    private static createPackageObjects = async (values: PluginAnswerValues | ThemeAnswerValues): Promise<Array<ScaffoldJsonUpdates> | any> => {
        try {

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
            console.log('readPackageObjects()');
            console.error(err);
        }
    };
}
