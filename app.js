"use strict";

const Discord = require("discrod.js");
require("dotenv").config();

const client = new Discord.Client();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
    if (msg.content === "") { 
        msg.reply();
    }
});

client.login(process.env.DISCORD_TOKEN);
