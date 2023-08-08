// Community modules
import fs from 'fs';
import colors from 'colors';
import fse from 'fs-extra';
import path from 'path';
// Package modules
import PathUtils from '../../utils/path-utils.js';
const { updateScaffoldFile } = require('../common/update-scaffold-file.js');
/**
 * @description
 *
 * @param {InitAnswers} answers
 * @param {ProjectConfig} config
 * @param {string} salts
 * @return void
 */
const scaffoldProject = async (answers, config, salts) => {
    try {
        const configFile = `${await PathUtils.whereAmI()}/wp-config.php`;
        let updateObjectsArray = [];
        if (fs.existsSync(configFile)) {
            console.log(colors.red('There is already a wp-config.php file.'));
            process.exit(0);
        }
        else {
            // Copy over and updates our values
            fse.copySync(`${path.join(__dirname + '../../../../scaffolding/project')}`, await PathUtils.whereAmI(), { overwrite: false });
            // Our common root files
            fse.copySync(`${path.join(__dirname + '../../../../scaffolding/common/root')}`, await PathUtils.whereAmI(), { overwrite: false });
            // NPM doesn't like to publish the .gitignore file, so handle that here
            if (fs.existsSync(`${await PathUtils.whereAmI()}/.gitignores`)) {
                const oldPath = path.join(await PathUtils.whereAmI(), '/.gitignores');
                const newPath = path.join(await PathUtils.whereAmI(), '/.gitignore');
                fs.renameSync(oldPath, newPath);
            }
            if (answers?.databaseSetup && typeof answers?.databaseSetup !== 'undefined') {
                const configDatabaseObjects = [
                    {
                        fileName: 'wp-config.php',
                        stringToUpdate: 'DATABASE_NAME_HERE',
                        updateString: answers.databaseName,
                    },
                    {
                        fileName: 'wp-config.php',
                        stringToUpdate: 'USERNAME_HERE',
                        updateString: answers.databasePassword,
                    },
                    {
                        fileName: 'wp-config.php',
                        stringToUpdate: 'PASSWORD_HERE',
                        updateString: answers.databaseUsername,
                    },
                ];
                updateObjectsArray.push(...configDatabaseObjects);
            }
            const configObjects = [
                {
                    fileName: 'wp-config.php',
                    stringToUpdate: '// ADD_OUR_SALTS_HERE',
                    updateString: salts,
                },
                {
                    fileName: 'wp-config-local.php',
                    stringToUpdate: 'DEV_SITE_URL',
                    updateString: config['dev-site-url'],
                },
            ];
            updateObjectsArray.push(...configObjects);
        }
        // Update our files based on object properties
        for (let update = 0; update < updateObjectsArray.length; update++) {
            if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {
                // console.log(updateObjectsArray[update].fileName);
                updateScaffoldFile(await PathUtils.whereAmI(), updateObjectsArray[update].fileName, {
                    stringToUpdate: updateObjectsArray[update].stringToUpdate,
                    updateString: updateObjectsArray[update].updateString,
                });
            }
        }
    }
    catch (err) {
        console.error(err);
    }
};
export default scaffoldProject;
