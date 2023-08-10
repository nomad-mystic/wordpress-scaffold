import fetch from 'cross-fetch';
export default class RestUtils {
    static apiGetText(url) {
        return fetch(url)
            .then((response) => {
            return response.text();
        })
            .then(text => text)
            .catch((err) => console.error(err));
    }
}
