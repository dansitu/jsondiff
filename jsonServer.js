var express = require('express');
var bodyParser = require('body-parser');

var jsonDiff = require('./jsonDiff');

var app = express();

app.use(bodyParser.json());

var jsonObject;

app.post('/json', function(req, res) {

  console.log('Storing JSON object');

  if(Array.isArray(req.body)) {
    var msg = 'Arrays are unsupported';
    console.log(msg);
    return res.status(400).send(msg);
  }

  jsonObject = req.body;
  console.log('Object looks like:');
  console.log(JSON.stringify(jsonObject, null, ' '));
  return res.status(200).send();

});

app.put('/json', function(req, res) {

  if(!jsonObject) {
    var msg = 'Cannot apply diff before object has been POSTed';
    console.log(msg);
    return res.status(400).send(msg);
  }

  console.log('Received diff from client:')
  console.log(JSON.stringify(req.body, null, ' '));

  try {
    console.log('Patching JSON object');
    // Create a deep copy of the JSON object in case patch fails part way through
    var objectCopy = JSON.parse(JSON.stringify(jsonObject));
    jsonDiff.patch(objectCopy, req.body);
    console.log('Object looks like:');
    console.log(JSON.stringify(objectCopy, null, ' '));
    jsonObject = objectCopy;
  } catch(e) {
    var msg = 'Invalid diff; could not apply.';
    console.log(msg);
    return res.status(400).send(msg);
  }

  res.status(200).send();

});

app.listen(8080);

console.log('Listening on 8080');

