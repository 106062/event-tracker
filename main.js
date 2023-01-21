"use strict";

const yargs = require("yargs/yargs");
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const { getCurrentDataTable, getDiffDataTable } = require("./lib/apis.js");

let olderInfo = [];

async function main() {
    if (argv.eventID) {
        let tmp = await getCurrentDataTable(argv.eventID);
        if (olderInfo.length !== 0) {
            getDiffDataTable(olderInfo, tmp);
            olderInfo = tmp;
        } else {
            olderInfo = tmp;
        }
    } else {
        console.log("Tell the Info with eventID");
        return -1;
    }
}

setInterval(main, 3600000);
main();
