
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
 * Patches an `original` object with a sequence of changes defined by `patch`
 */
JSONDiff.patch = function(original, patch) {

  patch.forEach(function(item) {
    if(item.action === 'remove') {
      delete original[item.key];
      return;
    }

    if(item.action === 'replace') {
      original[item.key] = item.value;
      return;
    }

    if(item.action === 'add') {
      original[item.key] = item.value;
      return;
    }

    if(item.action === 'edit') {
      JSONDiff.patch(original[item.key], item.edits);
    }
  });

  return original;

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

  // If we made it this far, this property is an object.
  // If the property remains an object, recurse to get changes.
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
  // Object(test) returns the same object if test is an Object or Array, else null
  return (test !== Object(test));
};

JSONDiff.isArray = function(test) {
  return test.constructor === Array;
}

JSONDiff.isObject = function(val) {
  return !JSONDiff.isPrimitive(val);
}

module.exports = JSONDiff;

