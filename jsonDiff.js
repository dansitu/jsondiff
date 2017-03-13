var left = {
    "id": 2,
    "firstName": "Joseph",
    "lastName": "Smith",
    nullToValue: null,
    valueToNull: 'value',
    nullToNull: null,
    "shippingAddress": {
        "street": "6209 Novick Road",
        "suite": "142",
        "city": "New Haven",
        "zip": "06533",
        "state": "CT",
        otherState: {
          hello: true,
          gone: 'yes',
          newData: {
            tree: 'nope'
          }
        }
    },
    "hobbies": ["Fishing", "Hiking"]
};

var right = {
    "id": 2,
    "firstName": "Joseph",
    "middleName": "Nicolas",
    "lastName": "Smith",
    nullToValue: 'value',
    valueToNull: null,
    nullToNull: null,
    newNull: null,
    "shippingAddress": {
        "street": "53 Kings Park",
        "company": "Acme Inc.",
        "city": "New Haven",
        "zip": "07532",
        "state": "CT",
        otherState: {
          hello: true,
          newData: {
            tree: 'yay'
          }
        }
    },
    "hobbies": ["Fishing", "Chess"]
};

var JSONDiff = {};
/*
 * Returns a diff array that describes the changes from `original` to `replacement`
 */
JSONDiff.deepDiff = function (original, replacement) {

  var edits = [];

  // Record any updates or removals
  Object.keys(original).forEach(function(key) {
    JSONDiff.recordUpdates(key, original, replacement, edits);
  });

  // Record any additions
  Object.keys(replacement).forEach(function(key) {
    JSONDiff.recordAddition(key, original, replacement, edits);
  });

  return edits;

};

/*
 * Checks for property updates and adds to `edits` array
 */
JSONDiff.recordUpdates = function(key, original, replacement, edits) {
  var originalProperty = original[key];

  // If property no longer present, remove it
  if(!replacement.hasOwnProperty(key)) {
    edits.push(JSONDiff.removeKey(key));
    return;
  }

  var newProperty = replacement[key];

  // If property is a primitive, compare equality
  if(JSONDiff.isPrimitive(originalProperty)) {
    // Update if value has changed
    if(original[key] !== replacement[key]) {
      edits.push(JSONDiff.replaceKey(key, newProperty));
    }
    return;
  }

  // If property is an array, replace it
  if(JSONDiff.isArray(originalProperty)) {
    edits.push(JSONDiff.replaceKey(key, newProperty));
    return;
  }

  // Otherwise, this property is an object.
  // If the property is still an object, recurse to get changes.
  if(JSONDiff.isObject(newProperty)) {
    var subdiff = JSONDiff.deepDiff(originalProperty, newProperty, key);
    if(subdiff.length) edits.push(JSONDiff.editKey(key, subdiff));
    // Otherwise, replace with the new value
  } else {
    edits.push(JSONDiff.replaceKey(key, newProperty));
  }

};

/*
 * Checks for a property addition and adds to `edits` array
 */
JSONDiff.recordAddition = function(key, original, replacement, edits) {
  if(!original.hasOwnProperty(key)) {
    edits.push(JSONDiff.addKey(key, replacement[key]));
  }
};

/*
 * Action definitions that make up diff
 */
JSONDiff.replaceKey = function(key, value) {
  return { action: 'replace', key: key, value: value };
};

JSONDiff.removeKey = function(key) {
  return { action: 'remove', key: key };
};

JSONDiff.addKey = function(key, value) {
  return { action: 'add', key: key, value: value };
};

JSONDiff.editKey = function(key, subdiff) {
  return { action: 'edit', key: key, edits: subdiff };
};

/*
 * Tests for property types
 */
JSONDiff.isPrimitive = function(test) {
  return (test !== Object(test));
};

JSONDiff.isArray = function(test) {
  return test.constructor === Array;
}

JSONDiff.isObject = function(val) {
  return !JSONDiff.isPrimitive(val);
}

module.exports = JSONDiff;

console.log(JSON.stringify(JSONDiff.deepDiff(left, right), null, '  '));
