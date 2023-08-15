// Community modules
import fs from 'fs';
import colors from 'colors';
import fse from 'fs-extra';
import path from 'path';

// Package modules
// Utils
import PathUtils from '../../utils/path-utils.js';

// Functions
import { updateScaffoldFile } from '../common/update-scaffold-file.js';

// Root
import { packageRootDir } from '../../utils/package-root.js';

// Interfaces
import InitAnswers from '../../interfaces/project/interface-init-answers.js';
import ScaffoldJsonUpdates from '../../interfaces/common/interface-scaffold-json-updates.js';
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
        // Get our paths
        const whereAmI: string = await PathUtils.whereAmI();
        const configFile: string = `${whereAmI}/wp-config.php`;

        // Array for updates
        let updateObjectsArray: Array<ScaffoldJsonUpdates> = [];

        if (fs.existsSync(configFile)) {
            console.log(colors.red('There is already a wp-config.php file.'));

            process.exit(0);

        } else {

            // Copy over and updates our values
            fse.copySync(`${path.join(`${packageRootDir}/scaffolding/project`)}`, whereAmI, { overwrite: false });

            // Our common root files
            fse.copySync(`${path.join(`${packageRootDir}/scaffolding/common/root`)}`, whereAmI, { overwrite: false });

            // NPM doesn't like to publish the .gitignore file, so handle that here
            if (fs.existsSync(`${whereAmI}/.gitignores`)) {
                const oldPath: string = path.join(whereAmI, '/.gitignores');
                const newPath: string = path.join(whereAmI, '/.gitignore');

                fs.renameSync(oldPath, newPath);
            }

            if (answers?.databaseSetup && typeof answers?.databaseSetup !== 'undefined') {
                const configDatabaseObjects: Array<ScaffoldJsonUpdates> = [
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

            const configObjects: Array<ScaffoldJsonUpdates>  = [
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
                    whereAmI,
                    updateObjectsArray[update].fileName,
                    updateObjectsArray[update].stringToUpdate,
                    updateObjectsArray[update].updateString
                );

            }
        }
    } catch (err: any) {
        console.log('scaffoldProject()');
        console.error(err);
    }
};

export default scaffoldProject;
