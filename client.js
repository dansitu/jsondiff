var fs = require('fs');
var jsonDiff = require('jsonDiff');

/*
 * Input Validation
 */

var args = process.argv.slice(2);

var instructions = 'client.js init <path-to-json> OR clientjs update <path-to-json>';

if(args.length !== 2) {
  console.log(instructions);
  process.exit(1);
}

if(!(args[0] === 'init' || args[0] === 'update')) {
  console.log(instructions);
  process.exit(1);
}

/*
 * Read and parse input JSON
 */
var filePath = args[1];
var inputFile;

try {
  inputFile = fs.readFileSync(filePath, { encoding: 'utf8' });
} catch (e) {
  console.log('Could not read file at ' + filePath);
  console.log(e);
  process.exit(1);
}

var inputJSON;

try {
  inputJSON = JSON.parse(inputFile);
} catch (e) {
  console.log('Could not parse JSON from file ' + filePath);
  console.log(e);
  process.exit(1);
}

/*
 * Communicate with server
 */
if(args[0] === 'init') {
  // post to server
  console.log('Initiation successful');
  process.exit();
} else {
  // Read stored original JSON
  var storageFile;
  var storedJSON;
  try {
    storageFile = fs.readFileSync(__dirname + '/storage/storage.json', { encoding: 'utf8' });
    storedJSON = JSON.parse(storageFile);
  } catch (e) {
    console.log('Could not read storage file');
    console.log(e);
    process.exit(1);
  }

  var diff = jsonDiff.deepDiff(original
}
