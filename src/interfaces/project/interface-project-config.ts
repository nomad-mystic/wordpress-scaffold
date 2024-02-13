import ActivePlugins from './interface-active-plugins.js';

export default interface ProjectConfig {
    'project-name': string;
    'project-namespace': string;
    'active-them': string
    'active-theme-path': string;
    'active-plugins': Array<ActivePlugins>;
    'site-url': string;
    'dev-site-url': string;
    'absolute-project-folder': string;
    'absolute-themes-folder': string;
    'description': string;
    'front-end-framework': string;
}
