var should = require('should');
var jsonDiff = require('../jsonDiff');

describe('JSONDiff', function() {

  describe('#deepDiff()', function() {
    it('should return an empty array if there is no json', function() {
    
      var left = {};
      var right = {};
      var diff = jsonDiff.deepDiff(left, right);

      diff.length.should.equal(0);

    });

    it('should return an empty array if there are no changes', function() {
    
      var left = {
        someKey: 'value',
        deep: {
          another: 'level'
        }
      };
      var right = {
        someKey: 'value',
        deep: {
          another: 'level'
        }
      };

      var diff = jsonDiff.deepDiff(left, right);

      diff.length.should.equal(0);
    
    });

  });

});
