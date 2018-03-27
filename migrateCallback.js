// Import express and request modules
const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const _ = require('lodash')

// Instantiates Express and assigns our app variable to it
var app = express()

app.use(bodyParser.json())
// Again, we define a port we want to listen to
const PORT = 5000

// Lets start our server
app.listen(PORT, function() {
  //Callback triggered when server is successfully listening. Hurray!
  console.log('Example app listening on port ' + PORT)
})

const vars = []

app.post('/', function(req, res) {
  console.log('pushing', req.body.var)
  vars.push(req.body.var)

  res.sendStatus(200)
})

app.get('/', function(req, res) {
  res.send(JSON.stringify(_.uniq(vars)))
})
