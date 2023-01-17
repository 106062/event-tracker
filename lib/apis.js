"use strict";
const axios = require("axios");
const { printTable } = require('console-table-printer');

async function getCurrentEvent() { 
    let date = new Date().getTime();
    const url = "";
    try {
        const eventID = "";
        return eventID;
    } catch (err) { 
        console.log("getCurrentEventERR: " + err);
    }
}
// Get data
async function getCurrentBoard(evntID) {
    const url = `https://bestdori.com/api/eventtop/data?server=0&event=${evntID}&mid=0&latest=1`
    try {
        const reponse = await axios.get(url);
        const data = reponse.data;
        return data;
    } catch (err) { 
        console.log("getCurrentBoardErr: " + err);
    }
}
// Display the current board
async function getCurrentDataTable(evntID) {
    let date = new Date();
    const data = await getCurrentBoard(evntID);

    const userList = {};
    let DataInfo = [];

    for (let i = 0; i < data.users.length; i++) {
        userList[data.users[i].uid] = data.users[i].name;
    }
    console.log("時間: %s", date.toString());
    for (let i = 0; i < data.points.length; i++) {
        DataInfo[i] = {
            num: (i + 1),
            userID: userList[data.points[i].uid],
            points: data.points[i].value,
            diffpoints: 0
        }
        if (i === 0) {
            DataInfo[i] = {
                "順位": (i + 1),
                "名前": (userList[data.points[i].uid]).toString(),
                "ポイント": (data.points[i].value).toString() + " Pts",
                "上位との差": "0 Pts"
            }
        } else { 
            DataInfo[i] = {
                "順位": (i + 1),
                "名前": (userList[data.points[i].uid]).toString(),
                "ポイント": (data.points[i].value).toString() + " Pts",
                "上位との差": ((data.points[i - 1].value) - data.points[i].value).toString() + " Pts"
            }
        }
    }
    printTable(DataInfo);
}

module.exports = { getCurrentBoard, getCurrentDataTable };

