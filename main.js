"use strict";

const { getCurrentBoard } = require("./lib/apis.js")

async function main() {
    const data = await getCurrentBoard();
    console.log(data);
}

main();
