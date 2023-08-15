import { glob } from 'glob';
import { updateScaffoldFile } from '../common/update-scaffold-file.js';
const updateScaffoldClasses = async (values) => {
    try {
        let { newThemePath, projectNamespace, } = values;
        let updateObjectsArray = [];
        const phpFiles = glob.sync(`${newThemePath}/classes/**/*.php`, {
            nodir: true,
        });
        let classFileUpdates = [];
        if (phpFiles && typeof phpFiles !== 'undefined' && phpFiles.length > 0) {
            for (let classPath = 0; classPath < phpFiles.length; classPath++) {
                if (phpFiles[classPath] && typeof phpFiles[classPath] !== 'undefined') {
                    let classObject = {};
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
        for (let update = 0; update < updateObjectsArray.length; update++) {
            if (updateObjectsArray[update] && typeof updateObjectsArray[update] !== 'undefined') {
                updateScaffoldFile(updateObjectsArray[update].updatePath, updateObjectsArray[update].fileName, updateObjectsArray[update].stringToUpdate, updateObjectsArray[update].updateString);
            }
        }
    }
    catch (err) {
        console.log('updateScaffoldClasses()');
        console.error(err);
    }
};
export default updateScaffoldClasses;
