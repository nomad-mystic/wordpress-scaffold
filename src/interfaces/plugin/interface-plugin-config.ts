export default interface PluginConfig {
    'absolute-project-folder'?: string;
    'absolute-themes-folder'?: string;
    'description'?: string;
    'site-url'?: string;
    'dev-site-url'?: string;
    'project-name'? : string;
    'project-namespace'? : string;
    [propName: string]: any;
}
