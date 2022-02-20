// Community modules
const {
    pascalCase,
    pascalCaseTransformMerge,
} = require('pascal-case');

/**
 * @description
 *
 * @param {string} string
 * @return {string}
 */
const addDashesToString = (string) => {

    return string.replaceAll(' ', '-');

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

module.exports = {
    addDashesToString,
    capAndSnakeCaseString,
    pascalCaseString,
}
