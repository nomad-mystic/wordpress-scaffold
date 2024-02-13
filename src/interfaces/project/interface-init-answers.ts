export default interface InterfaceInitAnswers {
    databaseSetup?: boolean | undefined;
    databaseName?: string | undefined;
    databasePassword?: string | undefined;
    databaseUsername?: string | undefined;
    siteTitle?: string | undefined;
    siteAdminUser?: string | undefined;
    adminEmail?: string | undefined;
    siteAdminPassword?: string | undefined;
    projectName?: string | undefined;
    siteUrl?: string | undefined;
    devSiteUrl?: string | undefined;
    type?: 'project';
}
