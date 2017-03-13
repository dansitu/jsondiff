var fs = require('fs');

var jsonDiff = require('./jsonDiff');

var args = process.argv.slice(2);

var instructions = '\nI will watch a JSON file for changes and sync them with the server.\n';
instructions += '\n\tjsonClient.js <path-to-json>\n';

if(args.length !== 1) {
  console.log(instructions);
  process.exit(1);
}

var filePath = args[0];

console.log('Watching file at ' + filePath);

var jsonObject;

// Force a read/upload cycle
doWork();

// Watch file for any changes
fs.watchFile(filePath, doWork);

function doWork(curr, prev) {
  if(jsonObject) console.log('File write detected');

  // Try to read the file. If we fail, print an error but keep watching.
  try { 
    var file = fs.readFileSync(filePath, { encoding: 'utf8' });
    var fileJSON = JSON.parse(file);
  } catch(e) {
    console.log('Problem reading and parsing file ' + filePath);
    console.log(e);
    return;
  }

  // If we're not already tracking JSON, store this data
  if(!jsonObject) {
    jsonObject = fileJSON;
    // TODO: Send to server
    console.log('Sent file to server');
    return;
  }

  // Diff the file and send it to the server
  var diff = jsonDiff.deepDiff(jsonObject, fileJSON);
  // TODO: Send to server
  if(diff.length) {
    console.log(diff)
    console.log('Synced diff with server');
    jsonObject = fileJSON;
  } else {
    console.log('No differences in JSON');
  }

};
