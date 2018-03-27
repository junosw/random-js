// Import express and request modules
const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const _ = require('underscore')
const AWS = require('aws-sdk')

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

AWS.config.loadFromPath('/Users/joeteibel/.aws/config.json')

const sqs = new AWS.SQS()

app.get('/', function(req, res) {
  const msg = { message: 'hi' }

  const sqsOptions = {
    MessageBody: JSON.stringify(msg),
    QueueUrl:
      'https://sqs.us-west-2.amazonaws.com/903936877212/dev-kafka-worker'
  }

  sqs.sendMessage(sqsOptions, (err, data) => {
    if (err) {
      console.log(err, err.stack)
    } else {
      console.log(data)
    }
  })
  res.sendStatus(200)
})
