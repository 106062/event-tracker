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
            DataInfo[i] = {
                "uid": data.points[i].uid,
                "name": (userList[data.points[i].uid]).toString(),
                "points": (data.points[i].value)
            }
        } else { 
            Datatable[i] = {
                "順位": (i + 1),
                "名前": (userList[data.points[i].uid]).toString(),
                "ポイント": (data.points[i].value).toString() + " Pts",
                "上位との差": ((data.points[i - 1].value) - data.points[i].value).toString() + " Pts"
            }
            DataInfo[i] = {
                "uid": data.points[i].uid,
                "name": (userList[data.points[i].uid]).toString(),
                "points": (data.points[i].value)
            }
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
    for (let i = 0; i < newData.length; i++) {// new Record
        for (let j = i; j < olderData.length; j++) {// old Record
            if (newData[i].uid === olderData[j].uid) { // if same place
                difftable[i] = {
                    "pos": i,
                    "name": newData[i].name,
                    "diffpoint": (newData[i].points - olderData[i].points),
                    "point": newData[i].points
                }
            } else {
                for (let k = 0; k < olderData.length; k++) { // not in sameplace find again
                    if (newData[i].uid === olderData[k].uid) {
                        if (i < k) { // older
                            difftable[k] = {
                                "pos": i,
                                "name": newData[i].name,
                                "diffpoint": (newData[i].points - olderData[k].points),
                                "point": newData[i].points
                            }    
                        } else {
                            difftable[k] = {
                                "pos": k,
                                "name": newData[i].name,
                                "diffpoint": (newData[i].points - olderData[k].points),
                                "point": newData[i].points
                            }
                        }
                    } else { // new record
                        difftable[i] = {
                            "pos": i,
                            "name": newData[i].name,
                            "diffpoint": 0,
                            "point": newData[i].points
                        }
                    }
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

module.exports = { getCurrentBoard, getCurrentDataTable, getDiffDataTable };
