import path from 'path';
import { fileURLToPath } from 'url';
// @link https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const config = {
    packageRootDir: `${path.resolve(dirname)}`,
};
export let packageRootDir = config.packageRootDir;
