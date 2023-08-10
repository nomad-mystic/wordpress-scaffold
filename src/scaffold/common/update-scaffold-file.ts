// Community
import fs from 'fs';

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
export const updateScaffoldFile = (
    updatePath: string | undefined,
    fileName: string | undefined,
    stringToUpdate: any,
    updateString: any
): void => {
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
};
