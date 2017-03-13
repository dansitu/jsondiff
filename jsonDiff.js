var left = {
    "id": 2,
    "firstName": "Joseph",
    "lastName": "Smith",
    "shippingAddress": {
        "street": "6209 Novick Road",
        "suite": "142",
        "city": "New Haven",
        "zip": "06533",
        "state": "CT"
    },
    "hobbies": ["Fishing", "Hiking"]
};

var right = {
    "id": 2,
    "firstName": "Joseph",
    "middleName": "Nicolas",
    "lastName": "Smith",
    "shippingAddress": {
        "street": "53 Kings Park",
        "company": "Acme Inc.",
        "city": "New Haven",
        "zip": "07532",
        "state": "CT"
    },
    "hobbies": ["Fishing", "Chess"]
};

function diff(first, second) {

  var changes = [];

  function deepDiff(original, replacement, editingName) {

    var edits = [];

    var originalKeys = Object.keys(original);

    Object.keys(original).forEach(function(key) {
      var originalProperty = original[key];

      // If item no longer present, remove it
      if(!replacement.hasOwnProperty(key)) {
        edits.push(removeKey(key));
        return;
      }

      var newProperty = replacement[key];

      // If item is a primitive, compare equality
      if(isPrimitive(originalProperty)) {
        if(original[key] !== replacement[key]) {
          edits.push(replaceKey(key, newProperty));
        }
        return;
      }

      // If an array, replace it
      if(isArray(originalProperty)) {
        edits.push(replaceKey(key, newProperty));
        return;
      }
    
      // Otherwise, this property is an object.
      // If the new one is also an object, recurse
      if(isObject(newProperty)) {
        deepDiff(originalProperty, newProperty, key);
      } else {
        // Otherwise, just replace it
        edits.push(replaceKey(key, newProperty));
      }
      
    });

    // Check for any additions
    Object.keys(replacement).forEach(function(key) {
      if(!original.hasOwnProperty(key)) {
        edits.push(addKey(key, replacement[key]));
      }
    });

    // If we're editing a sub-object and there are edits, add a 'begin' and 'end'
    // so we can navigate to the appropriate property
    if(editingName) {
      if(edits.length) {
        changes = changes.concat(beginEdit(editingName), edits, endEdit());
      }
    } else {
      changes = changes.concat(edits);
    }
  
  };

  deepDiff(first, second);

  return changes;

};

function replaceKey(key, value) {
  return { action: 'replace', key: key, value: value };
};

function removeKey(key) {
  return { action: 'remove', key: key };
};

function addKey(key, value) {
  return { action: 'add', key: key, value: value };
};

function beginEdit(key) {
  return { action: 'beginEdit', key: key };
};

function endEdit() {
  return { action: 'endEdit' };
};

function isPrimitive(test) {
      return (test !== Object(test));
};

function isArray(test) {
  return test.constructor === Array;
}

function isObject(val) {
  return !isPrimitive(val);
}

console.log(diff(left, right));
