const Table = require('cli-table')
const Constants = require('./constants')

require('colors')

module.exports = {

    titleLog: function (title, ...theArgs) {
        var Helper = require('./helper');
        console.log(`\x1b[2m[${Helper.getDateFormat(Date.now(), Constants.FORMAT_TIME_GMT7)}]:\x1b[0m ${title.toUpperCase().bold.underline}:\x1b[0m`, ...theArgs, '\x1b[0m');
    },
    errorLog: async function (error, isWriteLog = false) {
        var Helper = require('./helper');
        this.consoleLogsColor(`\x1b[2m[${Helper.getDateFormat(Date.now(), Constants.FORMAT_TIME_GMT7)}]:\x1b[0m`, '\x1b[31m', error, '\x1b[0m');
        if (isWriteLog) {
          
        }
    },

    consoleLogs: function (...theArgs) {
        var Helper = require('./helper');
        this.consoleLogsColor(`\x1b[2m[${Helper.getDateFormat(Date.now(), Constants.FORMAT_TIME_GMT7)}]:\x1b[0m`, '\x1b[36m', ...theArgs, '\x1b[0m');
    },

    consoleLogsColor: function (...theArgs) {
        console.log(...theArgs);
    },

    log: function (data, title) {
        title = title || 'LOG';
        var table = new Table();
        console.log(`\x1b[36m---------------------${title.toUpperCase()}:\x1b[0m`);
        console.log(data);
        console.log("------------------------------------------------------------------------------------");
    },

    logs: function (header, ...theArgs) {
        console.log("");
        /* compact */
        var table = new Table({
            head: ['Key', 'Value'],
            colors: true,
        });

        theArgs.forEach(arg => {
            table.push([`\x1b[36m${arg[0]}\x1b[36m`, `\x1b[32m${arg[1]}\x1b[0m`]); //\x1b[4m
        })

        console.log(`\x1b[36m ${header}:\x1b[0m`);
        console.log(table.toString());
        console.log("");
    },

    error: function (error, title) {
        title = title || 'ERROR';
        var table = new Table({
            head: ['Key', 'Value'],
            colors: true
        });
        table.push([`\x1b[31m ${title}:\x1b[36m`, `\x1b[31m ${error}:\x1b[36m`]); //\x1b[4m
        console.log("");
        console.log(table.toString());
        console.log("");
    },
};

Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"