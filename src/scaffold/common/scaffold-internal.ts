// Core Modules
import fs from 'fs';
import path from 'path';

// Community Modules
import fse from 'fs-extra';

// Utils
import PathUtils from '../../utils/path-utils.js';

// Root
import { packageRootDir } from '../../../package-root.js';

/**
 * @description Make sure we have our internal folder, if not copy it over
 *
 * @return void
 */
export const scaffoldInternal = async (): Promise<void> => {

    if (!fs.existsSync(`${await PathUtils.whereAmI()}/internal`)) {

        fse.copySync(`${path.join(packageRootDir + '/scaffolding/internal')}`, `${await PathUtils.whereAmI()}/internal`, { overwrite: false });

    }

};
