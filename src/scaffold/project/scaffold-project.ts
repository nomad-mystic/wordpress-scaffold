// Community modules
import fs from 'fs';
import colors from 'colors';
import fse from 'fs-extra';
import path from 'path';

// Package modules
import PathUtils from '../../utils/path-utils.js';
import { updateScaffoldFile } from '../common/update-scaffold-file.js';
import { packageRootDir } from '../../../package-root.js';

// Interfaces
import InitAnswers from '../../interfaces/project/interface-init-answers.js';
import ProjectWpConfig from '../../interfaces/project/interface-wp-config.js';
import ProjectConfig from '../../interfaces/project/interface-project-config.js';

/**
 * @description
 *
 * @param {InitAnswers | void} answers
 * @param {ProjectConfig} config
 * @param {string} salts
 * @return Promise<void>
 */
const scaffoldProject = async (
    answers: InitAnswers | void,
    config: ProjectConfig,
    salts: string | void | undefined
): Promise<void> => {
    try {

        const configFile: string = `${await PathUtils.whereAmI()}/wp-config.php`
        let updateObjectsArray: Array<ProjectWpConfig> = [];

        if (fs.existsSync(configFile)) {
            console.log(colors.red('There is already a wp-config.php file.'));

            process.exit(0);

        } else {

            // Copy over and updates our values
            fse.copySync(`${path.join(packageRootDir + '/scaffolding/project')}`, await PathUtils.whereAmI(), { overwrite: false });

            // Our common root files
            fse.copySync(`${path.join(packageRootDir + '/scaffolding/common/root')}`, await PathUtils.whereAmI(), { overwrite: false });

            // NPM doesn't like to publish the .gitignore file, so handle that here
            if (fs.existsSync(`${await PathUtils.whereAmI()}/.gitignores`)) {
                const oldPath: string = path.join(await PathUtils.whereAmI(), '/.gitignores');
                const newPath: string = path.join(await PathUtils.whereAmI(), '/.gitignore');

                fs.renameSync(oldPath, newPath);
            }

            if (answers?.databaseSetup && typeof answers?.databaseSetup !== 'undefined') {
                const configDatabaseObjects: Array<ProjectWpConfig> = [
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

            const configObjects: Array<ProjectWpConfig>  = [
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
        for (let update: number = 0; update < updateObjectsArray.length; update++) {
            if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {

                updateScaffoldFile(
                    await PathUtils.whereAmI(),
                    updateObjectsArray[update].fileName,
                    updateObjectsArray[update].stringToUpdate,
                    updateObjectsArray[update].updateString
                );

            }
        }
    } catch (err) {
        console.error(err);
    }
};

export default scaffoldProject;
