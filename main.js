"use strict";

const yargs = require("yargs/yargs");
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const { getCurrentDataTable } = require("./lib/apis.js");

function main() {
    if (argv.eventID) {
        getCurrentDataTable(argv.eventID);
    } else { 
        console.log("Tell the Info with eventID");
    }
}

setInterval(main, 3600000);
