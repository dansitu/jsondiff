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

  try {
    console.log('Patching JSON object');
    jsonDiff.patch(jsonObject, req.body);
    console.log('Object looks like:');
    console.log(JSON.stringify(jsonObject, null, ' '));
  } catch(e) {
    var msg = 'Invalid diff; could not apply. Object may have lost integrity; clearing storage.';
    console.log(msg);
    jsonObject = null;
    return res.status(400).send(msg);
  }

  res.status(200).send();

});

app.listen(8080);
