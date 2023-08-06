const fetch = require('cross-fetch');

const apiGetText = (url) => {
    return fetch(url)
        .then((response) => {

            return response.text();

        })
        .then(text => text)
        .catch((err) => console.error(err));
};

module.exports = {
    apiGetText,
};

