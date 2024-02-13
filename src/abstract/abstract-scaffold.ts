// Interfaces
import InterfaceThemeAnswers from '../interfaces/theme/interface-theme-answers.js';
import InitAnswers from '../interfaces/project/interface-init-answers.js';
import InterfacePluginAnswers from '../interfaces/plugin/interface-plugin-anwsers.js';

/**
 * @classdesc Use this a base for creating the scaffolding for each type of CLI action
 * @class AbstractScaffold
 * @author Keith Murphy | nomadmystics@gmail.com
 */
export default abstract class AbstractScaffold {
    /**
     * @description Starting point for scaffolding our theme or project
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<void>
     */
    public static initializeScaffolding = async (): Promise<void> => {};

    /**
     * @description Perform tasks based on the user's answers
     * @protected
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param {InitAnswers | InterfaceThemeAnswers | InterfacePluginAnswers | any} answers
     * @return Promise<void>
     */
    protected static scaffoldFiles = async (answers: InitAnswers | InterfaceThemeAnswers | InterfacePluginAnswers | any):  Promise<void> => {};
}
