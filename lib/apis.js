"use strict";
const axios = require("axios");
const { printTable } = require("console-table-printer");

async function getCurrentEvent() { 
    let date = new Date().getTime();
    const url = "https://bestdori.com/api/events/all.5.json";
    try {
        const eventID = "";
        return eventID;
    } catch (err) { 
        console.log("getCurrentEventERR: " + err);
    }
}

// Get data
async function getCurrentBoard(evntID) {
    const url = `https://bestdori.com/api/eventtop/data?server=0&event=${evntID}&mid=0&latest=1`;
    try {
        const reponse = await axios.get(url);
        const data = reponse.data;
        return data;
    } catch (err) { 
        console.log("getCurrentBoardErr: " + err);
    }
}

// Get 50, 100, 1000 data, Update every 15 minutes
async function getBoardTable(eventID) {
    let Datatable = [];
    let date = new Date();
    let url = `https://bestdori.com/api/tracker/data?server=0&event=${eventID}&tier=50`;
    try {
        let reponse = await axios.get(url);
        let data = reponse.data;
        for (let i = data.cutoffs.length - 1; i < data.cutoffs.length; i++) {
            Datatable[0] = {
                "順位": 50,
                "ポイント": (data.cutoffs[i].ep).toString() + " Pts"
            };
        }
        url = `https://bestdori.com/api/tracker/data?server=0&event=${eventID}&tier=100`;
        reponse = await axios.get(url);
        data = reponse.data;
        for (let i = data.cutoffs.length - 1; i < data.cutoffs.length; i++) {
            Datatable[1] = {
                "順位": 100,
                "ポイント": (data.cutoffs[i].ep).toString() + " Pts"
            };
        }
        // url = `https://bestdori.com/api/tracker/data?server=0&event=${eventID}&tier=300`;
        // reponse = await axios.get(url);
        // data = reponse.data;
        // for (let i = data.cutoffs.length - 1; i < data.cutoffs.length; i++) {
        //     Datatable[2] = {
        //         "順位": 300,
        //         "ポイント": (data.cutoffs[i].ep).toString() + " Pts"
        //     };
        // }
        url = `https://bestdori.com/api/tracker/data?server=0&event=${eventID}&tier=1000`;
        reponse = await axios.get(url);
        data = reponse.data;
        for (let i = data.cutoffs.length - 1; i < data.cutoffs.length; i++) {
            Datatable[3] = {
                "順位": 1000,
                "ポイント": (data.cutoffs[i].ep).toString() + " Pts"
            };
        }
        console.log("ボーダー 時間: %s", date.toString());
        printTable(Datatable);
        return Datatable;
    } catch (err) {
        console.log("getBoardTabledErr: " + err);
    }
}

// Display the current board
async function getCurrentDataTable(evntID) {
    let date = new Date();
    const data = await getCurrentBoard(evntID);
    const userList = {};
    let Datatable = [];
    let DataInfo = [];

    for (let i = 0; i < data.users.length; i++) {
        userList[data.users[i].uid] = data.users[i].name;
    }

    console.log("順位表 時間: %s", date.toString());

    for (let i = 0; i < data.points.length; i++) {
        if (i === 0) {
            Datatable[i] = {
                "順位": (i + 1),
                "名前": (userList[data.points[i].uid]).toString(),
                "ポイント": (data.points[i].value).toString() + " Pts",
                "上位との差": "0 Pts"
            }
        } else {
            Datatable[i] = {
                "順位": (i + 1),
                "名前": (userList[data.points[i].uid]).toString(),
                "ポイント": (data.points[i].value).toString() + " Pts",
                "上位との差": ((data.points[i - 1].value) - data.points[i].value).toString() + " Pts"
            }
        }
        DataInfo[i] = {
            "uid": data.points[i].uid,
            "name": (userList[data.points[i].uid]).toString(),
            "points": (data.points[i].value)
        }
    }
    printTable(Datatable);
    return DataInfo;
}

// Display the pts/time table
function getDiffDataTable(olderData, newData) {
    let date = new Date();
    let difftable = [];
    // to quick sort
    for (let i = 0; i < newData.length; i++) { // new Record
        difftable[i] = {
            "pos": i,
            "name": newData[i].name,
            "diffpoint": 0,
            "point": newData[i].points
        }
        for (let j = 0; j < olderData.length; j++) { // old Record
            if (newData[i].uid === olderData[j].uid) { // if same place
                difftable[i] = {
                    "pos": i,
                    "name": newData[i].name,
                    "diffpoint": (newData[i].points - olderData[j].points),
                    "point": newData[i].points
                }
            }
        }
    }

    difftable.sort(function (oldData, newData) {
        return newData.diffpoint - oldData.diffpoint;
    });
    
    let result = [];
    for (let i = 0; i < difftable.length; i++) {
        result[i] = {
            "順位": (i + 1),
            "名前": (difftable[i].name).toString(),
            "ポイント": (difftable[i].point).toString() + " Pts",
            "時速": (difftable[i].diffpoint).toString() + " Pts/hr"
        }
    }
    console.log("時速表 時間: %s", date.toString());
    printTable(result);
}

module.exports = { getCurrentDataTable, getDiffDataTable, getBoardTable };
