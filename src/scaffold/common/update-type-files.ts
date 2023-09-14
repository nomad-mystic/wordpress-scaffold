// Core Modules
import fs from 'fs';
import path from 'path';

// Community Modules
import fse from 'fs-extra';
import { glob } from 'glob';

// Package Modules
import { packageRootDir } from '../../utils/package-root.js';

// Classes
import DebugUtils from '../../utils/debug-utils.js';

// Interfaces
import PluginAnswerValues from '../../interfaces/plugin/interface-plugin-answer-values.js';
import ScaffoldJsonUpdates from '../../interfaces/common/interface-scaffold-json-updates.js';
import ScaffoldCopyFolders from '../../interfaces/common/interface-scaffold-copy-folders.js';
import ThemeAnswerValues from '../../interfaces/theme/interface-theme-answer-values.js';

/**
 * @classdesc This class is used to update file contents based on the data it takes in.
 * @class UpdateTypeFiles
 * @author Keith Murphy | nomadmystics@gmail.com
 */
export default class UpdateTypeFiles {
    /**
     * @private
     * @type boolean
     */
    private static debugMode: boolean = false;

    /**
     * @description Copy over the files we need based on what is provided to this
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {Array<ScaffoldCopyFolders>} foldersToCopy
     * @return {Promise<void>}
     */
    public static copyFiles = async (foldersToCopy: Array<ScaffoldCopyFolders>): Promise<void> => {
        try {

            if (this.debugMode) {
                await DebugUtils.classDebug('UpdateTypeFiles.copyFiles()', foldersToCopy);
            }

            for (let copyFolder of foldersToCopy) {
                const sourceFolder: string = `${path.join(`${packageRootDir}/${copyFolder.source}`)}`;
                const destination: string = copyFolder.destination;

                fse.copySync(sourceFolder, destination, {
                        overwrite: false
                    }
                );
            }

        } catch (err: any) {
            console.log('UpdateTypeFiles.copyFiles()');
            console.error(err);
        }
    };

    /**
     * @description For each update object passed search and replace the values on our files
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {PluginAnswerValues | ThemeAnswerValues} values
     * @param {Array<ScaffoldJsonUpdates>} updateObjectsArray
     * @return {Promise<void>}
     */
    public static updateFiles = async (values: PluginAnswerValues | ThemeAnswerValues, updateObjectsArray: Array<ScaffoldJsonUpdates>): Promise<void> => {
        try {

            if (this.debugMode) {
                await DebugUtils.classDebug('UpdateTypeFiles.updateFiles()', values);
                await DebugUtils.classDebug('UpdateTypeFiles.updateFiles()', updateObjectsArray);
            }

            // Update our files based on object properties
            for (let update: number = 0; update < updateObjectsArray.length; update++) {
                if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {

                    await this.updateFile(
                        values?.finalPath,
                        updateObjectsArray[update]?.fileName,
                        updateObjectsArray[update]?.stringToUpdate,
                        updateObjectsArray[update]?.updateString,
                    );
                }
            }

        } catch (err: any) {
            console.log('UpdateTypeFiles.updateFiles()');
            console.error(err);
        }
    };

    /**
     * @description This will update the content of a new scaffold file with users inputs
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {string | undefined} updatePath
     * @param {string | undefined} fileName
     * @param {string} stringToUpdate
     * @param {string} updateString
     * @return void
     */
    private static updateFile = async (
        updatePath: string | undefined,
        fileName: string | undefined,
        stringToUpdate: any,
        updateString: any
    ): Promise<void> => {
        try {
            let updatedContent: string = '';

            // Make sure the files exists before we start updating them
            if (fs.existsSync(`${updatePath}/${fileName}`)) {
                // Get our file in memory
                let fileContents: string = fs.readFileSync(`${updatePath}/${fileName}`, 'utf8');

                // Replace our file with user input values
                let reg: RegExp = new RegExp(stringToUpdate, 'gm');

                updatedContent = fileContents.replaceAll(reg, updateString);

                // Write our updated values
                fs.writeFileSync(`${updatePath}/${fileName}`, updatedContent);
            }
        } catch (err: any) {
            console.log('UpdateTypeFiles.updateScaffoldFile()');
            console.error(err);
        }
    };

    /**
     * @description Based on the values from our answers update out class files
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     *  @param {PluginAnswerValues | ThemeAnswerValues} values
     * @return {Promise<void>}
     */
    public static updateClassFiles = async (values: PluginAnswerValues | ThemeAnswerValues): Promise<void> => {
        try {
            let updateObjectsArray: Array<ScaffoldJsonUpdates> = [];

            // Create our checks before we start the copy process
            const phpFiles = glob.sync(`${values.finalPath}/classes/**/*.php`, {
                nodir: true,
            });

            let classFileUpdates: ScaffoldJsonUpdates[] = [];

            // For each of the classes we scaffold replace their namespace names
            if (phpFiles && typeof phpFiles !== 'undefined' && phpFiles.length > 0) {
                for (let classPath: number = 0; classPath < phpFiles.length; classPath++) {

                    if (phpFiles[classPath] && typeof phpFiles[classPath] !== 'undefined') {
                        let classObject: ScaffoldJsonUpdates = {};

                        // Extract the information we need
                        const afterLastSlash: string = phpFiles[classPath].substring(phpFiles[classPath].lastIndexOf('/') + 1);
                        const beforeLastSlash: RegExpMatchArray | null = phpFiles[classPath].match(/^(.*[\\\/])/);

                        // @todo Check this
                        classObject.updatePath = beforeLastSlash ? beforeLastSlash[0].slice(0, -1) : values.finalPath + '/classes';

                        classObject.fileName = afterLastSlash;
                        classObject.stringToUpdate = 'PASCAL_NAME';
                        classObject.updateString = values?.namespace;

                        classFileUpdates.push(classObject);
                    }
                }

                updateObjectsArray.push(...classFileUpdates);
            }

            // Update our files based on object properties
            for (let update: number = 0; update < updateObjectsArray.length; update++) {
                if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {

                    await this.updateFile(
                        updateObjectsArray[update]?.updatePath,
                        updateObjectsArray[update]?.fileName,
                        updateObjectsArray[update]?.stringToUpdate,
                        updateObjectsArray[update]?.updateString,
                    );

                }
            }
        } catch (err: any) {
            console.log('UpdateTypeFiles.updateClassFiles()');
            console.error(err);
        }
    };

    /**
     * @description
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {any} values
     * @param {string} type
     * @return {Promise<void>}
     */
    public static updateWebpack = async (values: any, type: string = 'theme'): Promise<void> => {
        try {
            let webpackContent: string = fs.readFileSync(`${packageRootDir}/src/scaffold/mocks/mock-${type}-webpack.txt`, 'utf8');

            await this.updateFile(
                values.finalPath, // @todo This needs to be project root?
                'webpack.config.js',
                'WEBPACK_PATH',
                webpackContent,
            );

        } catch (err: any) {
            console.log('UpdateTypeFiles.updateWebpack()');
            console.error(err);
        }
    };
}
