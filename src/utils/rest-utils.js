"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cross_fetch_1 = __importDefault(require("cross-fetch"));
/**
 * @description Utils class for REST functions
 * @class RestUtils
 */
class RestUtils {
    /**
     * @description Pass this a url and get the response as text
     * @public
     *
     * @param {string} url The url to get the text from
     * @return Promise<string|void>
     */
    static apiGetText(url) {
        return (0, cross_fetch_1.default)(url)
            .then((response) => {
            return response.text();
        })
            .then(text => text)
            .catch((err) => console.error(err));
    }
}
exports.default = RestUtils;
