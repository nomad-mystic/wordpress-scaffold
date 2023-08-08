// Community modules
const fs = require('fs');
const colors = require('colors');
const fse = require('fs-extra');
const path = require('path');

// Package modules
const { whereAmI } = require('../../utils/path-utils');

const { updateScaffoldFile } = require('../common/update-scaffold-file');

// Interfaces
import InitAnswers from '../../interfaces/project/interface-init-answers.js';
import ProjectWpConfig from '../../interfaces/project/interface-wp-config.js';
import ProjectConfig from '../../interfaces/project/interface-project-config.js';

/**
 * @description
 *
 * @param {InitAnswers} answers
 * @param {ProjectConfig} config
 * @param {string} salts
 * @return void
 */
const scaffoldProject = (answers: InitAnswers, config: ProjectConfig, salts: string) => {
    const configFile = `${whereAmI()}/wp-config.php`
    let updateObjectsArray = [];

    if (fs.existsSync(configFile)) {
        console.log(colors.red('There is already a wp-config.php file.'));

        process.exit(0);

    } else {

        // Copy over and updates our values
        fse.copySync(`${path.join(__dirname + '../../../../scaffolding/project')}`, whereAmI(), { overwrite: false });

        // Our common root files
        fse.copySync(`${path.join(__dirname + '../../../../scaffolding/common/root')}`, whereAmI(), { overwrite: false });

        // NPM doesn't like to publish the .gitignore file, so handle that here
        if (fs.existsSync(`${whereAmI()}/.gitignores`)) {
            const oldPath = path.join(whereAmI(), '/.gitignores');
            const newPath = path.join(whereAmI(), '/.gitignore');

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

            // console.log(updateObjectsArray[update].fileName);

            updateScaffoldFile(
                whereAmI(),
                updateObjectsArray[update].fileName,
                {
                    stringToUpdate: updateObjectsArray[update].stringToUpdate,
                    updateString: updateObjectsArray[update].updateString,
                }
            );

        }
    }
};

export default scaffoldProject;
