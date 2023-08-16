import PluginAnswers from "../../interfaces/plugin/interface-plugin-anwsers.js";

const scaffoldPlugin = async (answers: PluginAnswers): Promise<void> => {
    try {

        console.log(answers);


    } catch (err: any) {
        console.log('scaffoldPlugin()');
        console.log(err);
    }
};

export default scaffoldPlugin;
