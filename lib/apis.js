"use strict";
const axios = require("axios");

async function getCurrentBoard(evnttID) { 
    const url = `https://bestdori.com/api/eventtop/data?server=0&event=${evnttID}&mid=0&latest=1`
    try {
        const reponse = await axios.get(url);
        const data = reponse.data;
        return data;
    } catch (err) { 
        console.log("getCurrentBoardErr: " + err);
    }
}

async function getCurrentDataTable() { 
    const data = await getCurrentBoard();
    const userList = {};

    for (let i = 0; i < data.users.length; i++) {
        userList[data.users[i].uid] = data.users[i].name;
    }

    for (let i = 0; i < data.points.length; i++) {
        console.log("%s %s, %s Pts, 1位との差 %s",
            (i + 1), userList[data.points[i].uid], data.points[i].value,
            (data.points[i].value - data.points[0].value)
        );
    }
}

module.exports = { getCurrentBoard, getCurrentDataTable };

