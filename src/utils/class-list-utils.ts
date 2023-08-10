const fs = require("fs");

/**
 * @description
 * @public
 * @author Keith Murphy | nomadmystics@gmail.com
 *
 * @return
 */
export const updateClassListPaths = async (pathToJson: string, arrayOfUpdateValues: any[]): Promise<void> => {

    if (!pathToJson || !arrayOfUpdateValues) {
        return;
    }

    // Get our class lists
    const classListContents = fs.readFileSync(pathToJson, 'utf8');
    const classListJson = JSON.parse(classListContents);

    for (let namespace = 0; namespace < classListJson.length; namespace++) {
        if (classListJson[namespace] && typeof classListJson[namespace] !== 'undefined') {
            let jsonNamespace = classListJson[namespace].namespace
            let namespaceObject = classListJson[namespace];

            for (const updateValue of arrayOfUpdateValues) {
                if (updateValue.namespace === jsonNamespace) {

                    namespaceObject.path = updateValue.path;

                }
            }
        }
    }

    fs.writeFileSync(pathToJson, JSON.stringify(classListJson));
};
