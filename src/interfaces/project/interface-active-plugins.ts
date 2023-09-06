import {PathLike} from "fs";

export default interface ActivePlugins {
    'plugin-name'?: string;
    'plugin-path': PathLike;
    'plugin-description'?: string;
    'plugin-front-end-framework'?: string;
}
