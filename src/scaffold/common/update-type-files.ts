// Core Modules
import fs from 'fs';
import path from 'path';

// Community Modules
import fse from 'fs-extra';

// Package Modules
import PluginAnswerValues from '../../interfaces/plugin/interface-plugin-answer-values.js';
import { packageRootDir } from '../../utils/package-root.js';
import ScaffoldJsonUpdates from "../../interfaces/common/interface-scaffold-json-updates.js";
import {glob} from "glob";
import {updateScaffoldFile} from "./update-scaffold-file.js";


/**
 * @classdesc
 * @class UpdateTypeFiles
 * @author Keith Murphy | nomadmystics@gmail.com
 */
export default class UpdateTypeFiles {
    /**
     * @description
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return {Promise<void>}
     */
    public static copyFiles = async (foldersToCopy: Array<any>): Promise<void> => {
        try {

            for (let copyFolder of foldersToCopy) {
                fse.copySync(`${path.join(`${packageRootDir}/${copyFolder.source}`)}`,
                    copyFolder.destination,
                    {
                        overwrite: false
                    }
                );
            }

        } catch (err: any) {
            console.log('UpdateTypeFiles.copyFiles()');
            console.error(err);
        }
    };

    public static updateFiles = async (values: PluginAnswerValues, updateObjectsArray: Array<ScaffoldJsonUpdates>): Promise<void> => {
        try {

            // Update our files based on object properties
            for (let update: number = 0; update < updateObjectsArray.length; update++) {
                if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {

                    await this.updateFile(
                        values.finalPath,
                        updateObjectsArray[update].fileName,
                        updateObjectsArray[update].stringToUpdate,
                        updateObjectsArray[update].updateString,
                    );
                }
            }


        } catch (err: any) {

            console.error(err);

        }
    }

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

            // MAke sure the files exists before we start updating them
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

    public static updateClassFiles = async (values: any): Promise<void> => {
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
                        classObject.updateString = values.namespace;

                        classFileUpdates.push(classObject);
                    }
                }

                updateObjectsArray.push(...classFileUpdates);
            }

            // Update our files based on object properties
            for (let update: number = 0; update < updateObjectsArray.length; update++) {
                if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {

                    console.log('updateObjectsArray[update]');
                    console.log(updateObjectsArray[update]);

                    await this.updateFile(
                        updateObjectsArray[update].updatePath,
                        updateObjectsArray[update].fileName,
                        updateObjectsArray[update].stringToUpdate,
                        updateObjectsArray[update].updateString,
                    );

                }
            }
        } catch (err: any) {
            console.log('UpdateTypeFiles.updateClassFiles()');
            console.error(err);
        }
    }
}
