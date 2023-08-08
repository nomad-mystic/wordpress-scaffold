import InitAnswers from './interface-init-answers.js';

export default interface ProjectOptions {
    type?: string | void;
    name?: string | void;
    message?: string | void;
    default?: boolean | string | void;
    when?(answers: InitAnswers): void;
    validate?(value: string): true | string;
}
