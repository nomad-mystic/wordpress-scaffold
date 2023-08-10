import fse from 'fs-extra';
import { glob } from 'glob';
import PathUtils from '../../utils/path-utils.js';
import { updateScaffoldFile } from '../common/update-scaffold-file.js';
import { getComposerPropertyInfo } from '../../utils/composer-utils.js';
import { updateClassListPaths } from '../../utils/class-list-utils.js';
const updateScaffoldClasses = async (values) => {
    try {
        let { newThemePath, projectNamespace, } = values;
        let updateObjectsArray = [];
        const whereAmI = await PathUtils.whereAmI();
        const composerExists = fse.pathExistsSync(`${whereAmI}/composer.json`);
        const themeClassListExists = fse.pathExistsSync(`${whereAmI}/internal/theme/class-list.json`);
        const phpFiles = glob.sync(`${newThemePath}/classes/**/*.php`, {
            nodir: true,
        });
        let classFileUpdates = [];
        if (phpFiles && typeof phpFiles !== 'undefined' && phpFiles.length > 0) {
            for (let classPath = 0; classPath < phpFiles.length; classPath++) {
                if (phpFiles[classPath] && typeof phpFiles[classPath] !== 'undefined') {
                    let classObject = {};
                    console.log(phpFiles[classPath]);
                    const afterLastSlash = phpFiles[classPath].substring(phpFiles[classPath].lastIndexOf('/') + 1);
                    const beforeLastSlash = phpFiles[classPath].match(/^(.*[\\\/])/);
                    classObject.updatePath = beforeLastSlash ? beforeLastSlash[0].slice(0, -1) : newThemePath + 'classes';
                    classObject.fileName = afterLastSlash;
                    classObject.stringToUpdate = 'PASCAL_NAME';
                    classObject.updateString = projectNamespace;
                    classFileUpdates.push(classObject);
                }
            }
            updateObjectsArray.push(...classFileUpdates);
        }
        if (themeClassListExists) {
            const classListObjects = [
                {
                    updatePath: `${whereAmI}/internal/theme`,
                    fileName: 'class-list.json',
                    stringToUpdate: 'PASCAL_NAME',
                    updateString: projectNamespace,
                }
            ];
            updateObjectsArray.push(...classListObjects);
        }
        if (composerExists) {
            const composerInfo = await getComposerPropertyInfo();
            await updateClassListPaths(`${whereAmI}/internal/theme/class-list.json`, composerInfo);
        }
        for (let update = 0; update < updateObjectsArray.length; update++) {
            if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {
                updateScaffoldFile(updateObjectsArray[update].updatePath, updateObjectsArray[update].fileName, updateObjectsArray[update].stringToUpdate, updateObjectsArray[update].updateString);
            }
        }
    }
    catch (err) {
        console.error(err);
    }
};
export default updateScaffoldClasses;
