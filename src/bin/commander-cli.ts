#!/usr/bin/env node

// Core Modules
import fs from 'fs';
import { execSync } from 'child_process';

// Community Modules
import { Command, Option } from 'commander';

// Package Modules
import { packageRootDir } from '../utils/package-root.js';

import CommanderOptions from '../config/commander-options.js';

/**
 * @description Build our CLI root
 * @public
 * @author Keith Murphy | nomadmystics@gmail.com
 *
 */
export default class CommanderCli {
    /**
     * @description Starting point for building the CLI
     * @public
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return {Promise<void>}
     */
    public static buildCommanderCli = async (): Promise<void> => {
        try {
            const program: Command | undefined = await this.buildProgram();

            const inputs: Command | undefined = program?.parse()
            const options: object = program?.opts() ? program.opts() : {};

            // Create Array for comparing inputs from the user
            const cliOptions: string[] = Object.keys(CommanderOptions);
            const userInputs: string[] = Object.keys(options);

            // Bail early
            if (userInputs && userInputs.length > 1) {
                console.log('Only one option can be used at a time! See --help');

                process.exit(1);
            }

            if (options && typeof options !== 'undefined' && cliOptions.includes(userInputs[0])) {
                await this.callCommand(userInputs[0]);
            }

        } catch (err: any) {
            console.log('CommanderCli.buildCommanderCli()');
            console.error(err);

        }
    }

    /**
     * @description Build our Commander CLI
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return {Promise<Command | undefined>}
     */
    private static buildProgram = async (): Promise<Command | undefined> => {
        try {
            const program: Command = new Command();

            program.description('CLI for scaffolding WordPress websites');
            program.name('wps');
            program.allowUnknownOption(true);

            program.addOption(new Option('-pi, --project-init', 'Call the Project Init command'))
            program.addOption(new Option('-t, --theme', 'Call the Theme command'))
            program.addOption(new Option('-p, --plugin', 'Call the Plugin command'))

            return program;

        } catch (err) {

            console.log('CommanderCli.buildCommander()');
            console.error(err);

        }
    };

    /**
     * @description Based on the command, execute it
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @return {Promise<void>}
     */
    private static callCommand = async (command: string): Promise<void> => {
        try {
            const path: string = CommanderOptions[command].path as string;
            const fullPath: string = `${packageRootDir}dist/${path}`;

            // Bail early
            if (!fs.existsSync(fullPath)) {
                console.log('Path to command doesn\'t! Contact the maintainer');

                process.exit(1);
            }

            execSync(fullPath, { stdio: 'inherit' });

        } catch (err) {

            console.log('CommanderCli.callCommand()');
            console.error(err);

        }
    };
}

await CommanderCli.buildCommanderCli();
