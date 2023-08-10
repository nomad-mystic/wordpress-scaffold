import 'dotenv/config';
export default class DebugUtils {
    static isDebugFullMode = async () => {
        const isDebugMode = await this.isDebugMode();
        const wordPressDebugPath = await this.isDebugWordPressPath();
        return isDebugMode && wordPressDebugPath;
    };
    static isDebugMode = async () => {
        const isDebugMode = !!process.env?.DEBUG;
        return isDebugMode;
    };
    static isDebugWordPressPath = async () => {
        const wordPressDebugPath = !!process.env?.WORDPRESS_PATH;
        return wordPressDebugPath;
    };
}
