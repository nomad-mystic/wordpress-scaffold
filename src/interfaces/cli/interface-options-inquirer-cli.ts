import InitAnswers from '../project/interface-init-answers.js';
import InterfaceThemeAnswers from '../theme/interface-theme-answers.js';

export default interface InterfaceInquirerCliOptions {
    type?: string | void;
    name?: string | void;
    message?: string | void;
    default?: boolean | string | void;
    choices?: Array<string>
    when?(answers: InitAnswers | InterfaceThemeAnswers): void;
    validate?(value: string): boolean | string;
}
