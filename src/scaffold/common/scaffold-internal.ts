// Core Modules
import fs from 'fs';
import path from 'path';

// Community Modules
import fse from 'fs-extra';

// Utils
import PathUtils from '../../utils/path-utils.js';

// Root
import { packageRootDir } from '../../utils/package-root.js';

/**
 * @description Make sure we have our internal folder, if not copy it over
 * @deprecated Use ProjectJson
 *
 * @return void
 */
export const scaffoldInternal = async (): Promise<void> => {
    const whereAmI: string = await PathUtils.whereAmI();

    if (!fs.existsSync(`${whereAmI}/internal`)) {

        fse.copySync(`${path.join(packageRootDir + '/scaffolding/internal')}`, `${whereAmI}/internal`, { overwrite: false });

    }

};
