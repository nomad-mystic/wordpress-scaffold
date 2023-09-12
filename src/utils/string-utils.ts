// Community modules
import { pascalCase, pascalCaseTransformMerge } from 'pascal-case';

/**
 * @class StringUtils
 */
export default class StringUtils {
    /**
     * @description Replace spaces in a string with dashes
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {string} replaceString
     * @return {Promise<string>}
     */
    public static addDashesToString = async (replaceString: string): Promise<string> => {
        if (replaceString === '') {
            return '';
        }

        return replaceString.replaceAll(' ', '-').toLowerCase();
    }

    /**
     * @description Replace dashes in a string with underscores
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {string} replaceString
     * @return {Promise<string>}
     */
    public static capAndSnakeCaseString = async (replaceString: string): Promise<string> => {
        let snakeCaseString: string = replaceString.replaceAll('-', '_');

        return snakeCaseString.toUpperCase();
    };

    /**
     * @description Transform a string into pascal case
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     * @uses https://www.npmjs.com/package/pascal-case
     *
     * @param {string} transformString
     * @return {Promise<string>}
     */
    public static pascalCaseString = async (transformString: string): Promise<string> => {
        return pascalCase(transformString,{
            transform: pascalCaseTransformMerge,
        });
    };

    /**
     * @description Transform a camel case string into a dashed one
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     * @link https://gist.github.com/youssman/745578062609e8acac9f?permalink_comment_id=2304728
     *
     * @param {string} replaceString
     * @returns {string}
     */
    public static camelCaseToDash = async (replaceString: string): Promise<string> => {
        return replaceString.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
    }
}
