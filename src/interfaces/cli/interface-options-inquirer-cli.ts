import InitAnswers from '../project/interface-init-answers.js';
import ThemeAnswers from '../theme/interface-theme-answers.js';

export default interface InquirerCliOptions {
    type?: string | void;
    name?: string | void;
    message?: string | void;
    default?: boolean | string | void;
    choices?: Array<string>
    when?(answers: InitAnswers | ThemeAnswers): void;
    validate?(value: string): true | string;
}
