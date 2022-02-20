/**
 * @description
 *
 * @param {string} string
 * @return {string}
 */
const addDashesToString = (string) => {

    return string.replaceAll(' ', '-');

};

module.exports = {
    addDashesToString,
}
