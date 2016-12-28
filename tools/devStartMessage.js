const chalk = require("chalk");

console.log(chalk.green(`
${chalk.blue("____ ____ _  _ ___")}
${chalk.blue(`|___ [__] |\\/| |--' . v${process.env.npm_package_version}`)}

${chalk.blue(process.env.npm_package_description)}

${chalk.yellow("Running in dev mode...")}
`));
