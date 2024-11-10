const ejs = require("ejs")
const fs = require('fs');
const path = require("path")
const csv = require("csvtojson")
const { Parser } = require('json2csv');

//parse csv files
var CsvfileAssignments = ("assignments.csv");
var CsvfileTeams = ("teams.csv");
CsvfileAssignments = path.resolve(CsvfileAssignments)
CsvfileTeams = path.resolve(CsvfileTeams)

csv().fromFile(CsvfileTeams).then((jsonObj) => {
    CsvfileTeams = jsonObj;
});

csv().fromFile(CsvfileAssignments).then((jsonObj) => {
    CsvfileAssignments = jsonObj;
    for (const i of CsvfileAssignments) {
        var lenCs = Object.keys(i).length - 2;
        var tables = []
        var tableNames = []
        var tableCategories = []

        for (var j = 0; j < lenCs; j++) {
            var slot = "Slot " + (j + 1);
            var currentSlot = i[slot];

            if (currentSlot != "No team for this time slot") {
                currentSlot = currentSlot.substring(currentSlot.indexOf(' ') + 1) //(Table 1)
                currentSlot = currentSlot.substring(currentSlot.indexOf(' ') + 1); // 1)
                currentSlot = currentSlot.replace(")", ""); //1
                tables.push(currentSlot)
                var currentTeam = CsvfileTeams.find(team => team.tableNumber == currentSlot);
                tableNames.push(currentTeam.teamName)
                tableCategories.push(currentTeam.categoryApplied)
            }
            if (j == (lenCs -1)) {
                ejs.renderFile("./judge.ejs", { tables, tableNames, tableCategories, judge: i.Judge, totalLen: lenCs }, function (err, str) {
                    fs.writeFile(`${i.Judge}.html`, str, (err) => {
                        if (err) {
                            console.error('Error writing to html file', err);
                        } else {
                            console.log('html file successfully created');
                        }
                    });

                });
            }
        }

    }
})


