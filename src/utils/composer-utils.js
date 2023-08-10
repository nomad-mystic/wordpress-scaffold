import fs from 'fs';
import fse from 'fs-extra';
import PathUtils from './path-utils.js';
export const getComposerPropertyInfo = async () => {
    const whereAmI = await PathUtils.whereAmI();
    const composerExists = fse.pathExistsSync(`${whereAmI}/composer.json`);
    let propertyValues = [];
    if (composerExists) {
        const composerContents = fs.readFileSync(`${whereAmI}/composer.json`, 'utf8');
        let composerJson = JSON.parse(composerContents);
        if (composerJson && typeof composerJson.autoload !== 'undefined' && typeof composerJson.autoload['psr-4'] !== 'undefined') {
            const Psr4 = composerJson.autoload['psr-4'];
            for (let namespaceValue in Psr4) {
                if (Object.hasOwn(Psr4, namespaceValue)) {
                    let namespaceName = namespaceValue;
                    let namespacePath = Psr4[namespaceValue][0];
                    let namespace = null;
                    let path = null;
                    if (namespaceName && typeof namespaceName !== 'undefined') {
                        namespace = namespaceName.replaceAll('\\', '');
                    }
                    if (namespacePath && typeof namespacePath !== 'undefined' && namespacePath.length > 0) {
                        path = namespacePath[0];
                    }
                    if (namespace && path) {
                        propertyValues.push({
                            namespace: namespace,
                            path: namespacePath,
                        });
                    }
                }
            }
            return propertyValues;
        }
    }
    return [];
};
