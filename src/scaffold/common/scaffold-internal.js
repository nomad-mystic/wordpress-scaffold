import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import PathUtils from '../../utils/path-utils.js';
import { packageRootDir } from '../../../package-root.js';
export const scaffoldInternal = async () => {
    const whereAmI = await PathUtils.whereAmI();
    if (!fs.existsSync(`${whereAmI}/internal`)) {
        fse.copySync(`${path.join(packageRootDir + '/scaffolding/internal')}`, `${whereAmI}/internal`, { overwrite: false });
    }
};
