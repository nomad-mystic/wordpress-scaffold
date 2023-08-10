import shell from 'shelljs';
export default class CheckDepends {
    static dependencyInstalled(dependency, message, exit = true) {
        const check = shell.which(dependency);
        if (!check || check.code !== 0) {
            shell.echo(message);
            if (exit) {
                shell.exit(1);
            }
        }
        return check;
    }
    ;
}
