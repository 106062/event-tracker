"use strict";

const Discord = require("discrod.js");
require("dotenv").config();

const client = new Discord.Client();
const { getCurrentDataTable, getDiffDataTable } = require("./lib/apis.js");

const command = "!";
let olddata = [];


client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
    try {
        // reply check
        if (msg.member.user.bot) { return; }// void to reply bot
        // if (!msg.guild || !msg.member) { return; }
        // if (!msg.member.user) { return; }

        if (msg.content.substring(0, command.length) === command) {
            const cmd = msg.content.substring(command.length).split(' ');
            switch (cmd[0]) { 
                case "trace":
                    msg.channel.send("Start Trace");
                    let data = getCurrentDataTable(cmd);
                    while (1) {
                        if (olddata.length > 0) {
                            let tmp = getDiffDataTable(olddata, data);
                            msg.channel.send("時速表");
                            msg.channel.send(tmp);
                            olddata = data;
                        } else { 
                            olddata = data;
                        }
                        msg.channel.send(data);
                        setInterval(getCurrentDataTable, 3600000);
                    }
                    break;
                case "stop":
                    msg.channel.send("Stop Trace");
                    break;
                default:
                    break;
            }
        }
    } catch (err) { 
        console.error("onMessageERR: ", err);
    }
    
});

async function getCurrentDataTable(cmd) { 
    await getCurrentDataTable(cmd);
}

client.login(process.env.DISCORD_TOKEN);
