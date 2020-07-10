// Import express and request modules
const express = require("express");
const axios = require("axios");
const request = require("request");
const bodyParser = require("body-parser");
const _ = require("underscore");

// Instantiates Express and assigns our app variable to it
var app = express();

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
// app.use(bodyParser.json());
app.use(bodyParser.raw());
// app.use(bodyParser.text());

// Again, we define a port we want to listen to
const PORT = 5340;

// Lets start our server
app.listen(PORT, function() {
  //Callback triggered when server is successfully listening. Hurray!
  console.log("Example app listening on port " + PORT);
});

app.post("/", function(req, res) {
  console.log("~~~~ Received ~~~~");
  console.log("Headers:", req.headers);
  // console.log("Body: ", req.body);

  // if (req.headers["content-type"] == "application/x-www-form-urlencoded") {
  //   console.log("WE CAN PARSE!");
  // }
  // axios({
  //   url: "http://localhost:3000/api/inbox/createProject",
  //   method: "POST",
  //   params: {
  //     id: "e911ce12-fc53-467a-a09c-bd5590fe7f0f"
  //   },
  //   data: req.body,
  //   headers: req.headers
  // })
  //   .then(response => {
  //     console.log("response status = ", response.status);
  //     console.log("response statusText = ", response.statusText);
  //   })
  //   .catch(error => {
  //     console.log("ERROR: ", error.Error);
  //   });
  req
    .pipe(
      request(
        {
          url: "http://localhost:3000/api/inbox/createProject",
          qs: {
            id: "e911ce12-fc53-467a-a09c-bd5590fe7f0f"
          },
          method: req.method,
          headers: req.headers
        },
        function(error, response, body) {
          if (error.code === "ECONNREFUSED") {
            console.error("Refused connection");
          } else {
            console.error("Error", error);
          }
        }
      )
    )
    .pipe(res);

  // res.sendStatus(200);
});

app.get("/linebreak", function(req, res) {
  console.log("- /br -");
  res.sendStatus(200);
});
