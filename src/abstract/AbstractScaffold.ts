// Interfaces
import ThemeAnswers from '../interfaces/theme/interface-theme-answers.js';
import InitAnswers from '../interfaces/project/interface-init-answers.js';
import PluginAnswers from '../interfaces/plugin/interface-plugin-anwsers.js';


export default abstract class AbstractScaffold {
    /**
     * @description Starting point for scaffolding our theme or project
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<void>
     */
    public static performScaffolding = async (): Promise<void> => {}

    /**
     * @description Perform tasks based on the user's answers
     * @protected
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return Promise<void>
     */
    protected static scaffoldFiles = async (answers: InitAnswers | ThemeAnswers | PluginAnswers | any):  Promise<void> => {};
}
