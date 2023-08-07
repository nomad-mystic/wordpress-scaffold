const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const {
    whereAmI,
} = require('../../utils/path-utils');

/**
 * @description Make sure we have our internal folder, if not copy it over
 *
 * @return void
 */
const scaffoldInternal = () => {

    if (!fs.existsSync(`${whereAmI()}/internal`)) {

        fse.copySync(`${path.join(__dirname + '../../../../scaffolding/internal')}`, `${whereAmI()}/internal`, { overwrite: false });

    }

};

module.exports = {
    scaffoldInternal,
};
