const fs = require('fs');
const colors = require('colors');

const {
    whereAmI,
} = require('../../utils/path-utils');
const fse = require("fs-extra");
const path = require("path");
const {updateScaffoldFile} = require("../../utils/update-scaffold-file");

/**
 * @description
 *
 * @param {Object} answers
 * @param {object} answers.projectName
 * @param {object} answers.databaseSetup
 * @param {object|null} answers.databaseName
 * @param {object|null} answers.databasePassword
 * @param {object|null} answers.databaseUsername
 * @param salts
 * @return void
 */
const scaffoldProject = (answers, salts) => {
    const configFile = `${whereAmI()}/wp-config.php`
    let updateObjectsArray = [];

    console.log(answers);
    console.log(configFile);
    console.log(salts);

    if (fs.existsSync(configFile)) {
        console.log(colors.red('There is already a wp-config.php file.'));

        process.exit(0);

    } else {

        // Copy over and updates our values
        fse.copySync(`${path.join(__dirname + '../../../../scaffolding/project')}`, whereAmI(), {overwrite: false});

        if (answers?.databaseSetup && typeof answers?.databaseSetup !== 'undefined') {
            const configObjects = [
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
                {
                    fileName: 'wp-config.php',
                    stringToUpdate: '// ADD_OUR_SALTS_HERE',
                    updateString: salts,
                },
            ];

            updateObjectsArray.push(...configObjects);
        }
    }

    // Update our files based on object properties
    for (let update = 0; update < updateObjectsArray.length; update++) {
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

module.exports = scaffoldProject;
