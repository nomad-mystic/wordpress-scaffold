import fetch from 'cross-fetch';

/**
 * @description Utils class for REST functions
 * @class RestUtils
 */
export default class RestUtils {
    /**
     * @description Pass this a url and get the response as text
     * @public
     *
     * @param {string} url The url to get the text from
     * @return Promise<string|undefined>
     */
    static apiGetText(url: string): Promise<string | void | undefined> {
        return fetch(url)
            .then((response) => {

                return response.text();

            })
            .then(text => text)
            .catch((err: any) => console.error(err));
    }
}
