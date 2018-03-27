// Import express and request modules
const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const _ = require('underscore')

// Instantiates Express and assigns our app variable to it
var app = express()

app.use(bodyParser.json())
// Again, we define a port we want to listen to
const PORT = 5340

// Lets start our server
app.listen(PORT, function() {
  //Callback triggered when server is successfully listening. Hurray!
  console.log('Example app listening on port ' + PORT)
})

app.post('/', function(req, res) {
  console.log('Received: ', req.body)
  res.sendStatus(200)
})

app.get('/linebreak', function(req, res) {
  console.log('- /br -')
  res.sendStatus(200)
})
