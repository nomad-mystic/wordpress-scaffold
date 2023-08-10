#! /usr/bin/env node
import 'dotenv/config';
import colors from 'colors';
import shell from 'shelljs';
import fs from 'fs';
import getProjectOptions from '../src/config/project-options.js';
import scaffoldProject from '../src/scaffold/project/scaffold-project.js';
import updateScaffoldJson from '../src/scaffold/common/update-scaffold-json.js';
import CheckDepends from '../src/utils/check-depends.js';
import RestUtils from '../src/utils/rest-utils.js';
import DebugUtils from '../src/utils/debug-utils.js';
import PathUtils from '../src/utils/path-utils.js';
import InquirerCli from '../src/cli/inquirer-cli.js';
import AbstractScaffold from "../src/abstract/AbstractScaffold.js";
CheckDepends.dependencyInstalled('php', 'Sorry, this script requires the PHP CLI');
CheckDepends.dependencyInstalled('wp', 'Sorry, this script requires the WP-CLI');
class ScaffoldProject extends AbstractScaffold {
    static isDebugFullMode = false;
    static whereAmI = '';
    static performScaffolding = async () => {
        try {
            const answers = await InquirerCli.performPromptsTasks(await getProjectOptions()).catch((err) => console.error(err));
            this.whereAmI = await PathUtils.whereAmI();
            this.isDebugFullMode = await DebugUtils.isDebugFullMode();
            await this.downloadWPCoreCode();
            const config = await this.scaffoldFiles(answers);
            await this.installWPCoreDB(answers);
            await this.installGit();
            console.log(colors.green(`Your ${config['project-name']} project has been scaffold.`));
        }
        catch (err) {
            console.error(err);
        }
    };
    static downloadWPCoreCode = async () => {
        if (this.isDebugFullMode) {
            shell.exec(`wp core download --path=${process.env.WORDPRESS_PATH}`);
        }
        else {
            shell.exec('wp core download');
        }
    };
    static installWPCoreDB = async (answers) => {
        if (answers?.databaseSetup) {
            shell.exec(`wp core install --url="${answers.siteUrl}" --title="${answers.siteTitle}" --admin_user="${answers.siteAdminUser}" --admin_password="${answers.siteAdminPassword}" --admin_email="${answers.adminEmail}" --skip-email`);
        }
    };
    static installGit = async () => {
        if (CheckDepends.dependencyInstalled('git', '', false) && !fs.existsSync('.git')) {
            if (!this.isDebugFullMode) {
                shell.exec('git init');
            }
        }
    };
    static scaffoldFiles = async (answers) => {
        try {
            const filePath = `${this.whereAmI}/internal/project/project-config.json`;
            await updateScaffoldJson(filePath, answers);
            const config = await updateScaffoldJson(filePath, {
                'absolute-project-folder': this.whereAmI,
            });
            let salts = await RestUtils.apiGetText('https://api.wordpress.org/secret-key/1.1/salt/');
            await scaffoldProject(answers, config, salts);
            return config;
        }
        catch (err) {
            console.error(err);
        }
    };
}
ScaffoldProject.performScaffolding().catch(err => console.error(err));
