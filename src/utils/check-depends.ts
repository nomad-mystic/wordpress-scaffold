const shell = require('shelljs');

export default class checkDepends {
    /**
     * @description Check for system dependency, if it doesn't exist exit
     *
     * @param {string} dependency Which dependency to check for
     * @param {string} message Display a message to the user
     * @param {boolean} exit Should we exit the process?
     * @return {string|void}
     */
    static dependencyInstalled(dependency: string, message: string, exit: boolean = true): string | void {
        const check = shell.which(dependency);

        // Display message
        if (!check) {
            shell.echo(message);
        }

        // Should we end the process?
        if (exit) {
            shell.exit(1);
        }

        // string or Null
        return check;
    };
}
