import path from 'path';
import { fileURLToPath } from 'url';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const config = {
    packageRootDir: `${path.resolve(dirname)}`,
};
export let packageRootDir = config.packageRootDir;
