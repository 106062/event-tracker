"use strict";

const yargs = require("yargs/yargs");
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const { getCurrentDataTable } = require("./lib/apis.js");

async function main() {
    if (argv.eventID) {
        const data = await getCurrentDataTable(argv.eventID);
    } else { 
        console.log("Tell the Info with eventID");
    }
}

main();
