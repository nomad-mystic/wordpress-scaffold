import fs from 'fs';
import colors from 'colors';
import fse from 'fs-extra';
import path from 'path';
import PathUtils from '../../utils/path-utils.js';
import { updateScaffoldFile } from '../common/update-scaffold-file.js';
import { packageRootDir } from '../../../package-root.js';
const scaffoldProject = async (answers, config, salts) => {
    try {
        const whereAmI = await PathUtils.whereAmI();
        const configFile = `${whereAmI}/wp-config.php`;
        let updateObjectsArray = [];
        if (fs.existsSync(configFile)) {
            console.log(colors.red('There is already a wp-config.php file.'));
            process.exit(0);
        }
        else {
            fse.copySync(`${path.join(`${packageRootDir}/scaffolding/project`)}`, whereAmI, { overwrite: false });
            fse.copySync(`${path.join(`${packageRootDir}/scaffolding/common/root`)}`, whereAmI, { overwrite: false });
            if (fs.existsSync(`${whereAmI}/.gitignores`)) {
                const oldPath = path.join(whereAmI, '/.gitignores');
                const newPath = path.join(whereAmI, '/.gitignore');
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
        for (let update = 0; update < updateObjectsArray.length; update++) {
            if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {
                updateScaffoldFile(whereAmI, updateObjectsArray[update].fileName, updateObjectsArray[update].stringToUpdate, updateObjectsArray[update].updateString);
            }
        }
    }
    catch (err) {
        console.log('scaffoldProject()');
        console.error(err);
    }
};
export default scaffoldProject;
