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

module.exports = {
    addDashesToString,
    capAndSnakeCaseString,
}
