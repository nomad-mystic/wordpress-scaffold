// Community modules
const {
    pascalCase,
    pascalCaseTransformMerge,
} = require('pascal-case');

/**
 * @description
 *
 * @param {string} replaceString
 * @return {string}
 */
const addDashesToString = (replaceString) => {
    if (typeof replaceString !== 'string' || replaceString === '') {
        return '';
    }

    return replaceString.replaceAll(' ', '-').toLowerCase();
};

/**
 * @description
 *
 * @param {string} string
 * @return {string}
 */
const capAndSnakeCaseString = (string) => {
    let snakeCaseString = string.replaceAll('-', '_');

    return snakeCaseString.toUpperCase();
};

/**
 * @description
 * @see https://www.npmjs.com/package/pascal-case
 *
 * @param {string} string
 * @return {string}
 */
const pascalCaseString = (string) => {
    return pascalCase(string,{
        transform: pascalCaseTransformMerge
    });
};

/**
 * @description
 * @see https://gist.github.com/youssman/745578062609e8acac9f?permalink_comment_id=2304728
 *
 * @param string
 * @returns {string}
 */
const camelCaseToDash = (string) => {
    return string.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}

module.exports = {
    addDashesToString,
    capAndSnakeCaseString,
    pascalCaseString,
    camelCaseToDash,
}
