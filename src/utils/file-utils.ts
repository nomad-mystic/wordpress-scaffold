// Core Modules
import fs from 'fs';

/**
 * @classdesc Add help functions for files to the project
 * @class FileUtils
 * @author Keith Murphy | nomadmystics@gmail.com
 */
export default class FileUtils {
    /**
     * @description Pass this a absolute path, and it will return a JSON.parsed object back
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {string} path
     * @return {Promise<object | any>}
     */
    public static getFileAsJson = async (path: string): Promise<object | any> => {
        try {
            // Extract our file
            const fileString: string = fs.readFileSync(`${path}`, 'utf8');

            // Send back an object
            return JSON.parse(fileString);

        } catch (err: any) {
            console.log('getPackageVersion()');
            console.error(err);
        }
    };
}
