# JSON Diff

## Initial Setup
Run `npm install` to fetch all dependencies.

## Library
The library is defined in `./jsonDiff.js` and exposes the `deepDiff` and `patch` functions.

### Library unit tests
There are unit tests in `./test/test.js`. Use `npm test` to run them.

## Server
Run `npm run server` to begin listening on port 8080.

The server responds to a `POST` to `/json` for initialization and `PUT` to `/json` to
apply a diff patch.

It will log both incoming diff data and the current state of its JSON object.

It is defined in `./jsonServer.js`.

## Client
Run `node jsonClient.js <path-to-json-file>` to begin watching a file for changes.

There is a sample JSON file at `./sample.json`.

When the client first loads, it will `POST` the JSON to the server.

On subsequent file changes, it will `PUT` a diff of the JSON to the server.

## Other Notes
Although the JSON spec supports arrays as the top level element, the JSONDiff library does
not, and the server will respond with `400` if an array is provided as the request body.

