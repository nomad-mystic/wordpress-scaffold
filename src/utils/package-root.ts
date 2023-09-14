
import path from 'path';
import { fileURLToPath } from 'url';

// @link https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
const filename: string = fileURLToPath(import.meta.url);
const dirname: string = path.dirname(filename);

const config = {
    packageRootDir: `${path.join(dirname, '../../')}`,
};

export let packageRootDir: string = config.packageRootDir;
