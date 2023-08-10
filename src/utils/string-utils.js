import { pascalCase, pascalCaseTransformMerge } from 'pascal-case';
export default class StringUtils {
    static addDashesToString = async (replaceString) => {
        if (replaceString === '') {
            return '';
        }
        return replaceString.replaceAll(' ', '-').toLowerCase();
    };
    static capAndSnakeCaseString = async (replaceString) => {
        let snakeCaseString = replaceString.replaceAll('-', '_');
        return snakeCaseString.toUpperCase();
    };
    static pascalCaseString = async (transformString) => {
        return pascalCase(transformString, {
            transform: pascalCaseTransformMerge,
        });
    };
    static camelCaseToDash = async (replaceString) => {
        return replaceString.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
    };
}
