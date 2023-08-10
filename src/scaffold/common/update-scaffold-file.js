import fs from 'fs';
export const updateScaffoldFile = (updatePath, fileName, stringToUpdate, updateString) => {
    let updatedContent = '';
    if (fs.existsSync(`${updatePath}/${fileName}`)) {
        let fileContents = fs.readFileSync(`${updatePath}/${fileName}`, 'utf8');
        let reg = new RegExp(stringToUpdate, 'gm');
        updatedContent = fileContents.replaceAll(reg, updateString);
        fs.writeFileSync(`${updatePath}/${fileName}`, updatedContent);
    }
};
