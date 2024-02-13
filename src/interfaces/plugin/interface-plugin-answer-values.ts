import InterfaceAnswerValues from '../common/interface-answer-values.js';

export default interface InterfacePluginAnswerValues extends InterfaceAnswerValues {
    pluginsPath?: string;
    frontEndFramework?: string;
    safeName?: string;
    capAndSnakeCasePlugin?: string;
    namespace?: string;
    type?: 'plugin';
};
