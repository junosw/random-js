const _ = require("lodash");
const csv = require("csv-parser");
const fs = require("fs");
const moment = require("moment");

let dateMap = {};

fs.createReadStream("/Users/joeteibel/Downloads/rt (1).csv")
  .pipe(csv())
  .on("data", (data) => {
    // for a particular date, how many states were under 1

    const date = moment(data.date);

    if (date.isAfter(moment("2020-03-01"))) {
      if (!dateMap[data.date]) {
        dateMap[data.date] = 0;
      }

      if (data.mean > 1) {
        dateMap[data.date] += 1;
      }
    }
  })
  .on("end", () => {
    console.log(dateMap);
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
    let writeString = "";
    _.map(dateMap, (count, date) => {
      writeString += `${date},${count}\n`;
    });
    fs.writeFile("helloworld.csv", writeString, function (err) {
      if (err) return console.log(err);
      console.log("Hello World > helloworld.txt");
    });
  });
