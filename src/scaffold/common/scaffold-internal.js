import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import PathUtils from '../../utils/path-utils.js';
import { packageRootDir } from '../../../package-root.js';
export const scaffoldInternal = async () => {
    if (!fs.existsSync(`${await PathUtils.whereAmI()}/internal`)) {
        fse.copySync(`${path.join(packageRootDir + '/scaffolding/internal')}`, `${await PathUtils.whereAmI()}/internal`, { overwrite: false });
    }
};
