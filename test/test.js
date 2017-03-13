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

    it('should return any removals', function() {
    
      var left = {
        someProperty: 'yay',
        otherProperty: 123
      };
      var right = {
      };

      var diff = jsonDiff.deepDiff(left, right);

      diff.length.should.equal(2);
      diff.should.deepEqual([
        { action: 'remove', key: 'someProperty' },
        { action: 'remove', key: 'otherProperty' },
      ]);
    
    });

    it('should return any replacements', function() {
    
      var left = {
        someProperty: 'yay',
        otherProperty: 123
      };
      var right = {
        someProperty: 'woo',
        otherProperty: {
          complex: true
        }
      };

      var diff = jsonDiff.deepDiff(left, right);

      diff.length.should.equal(2);
      diff.should.deepEqual([
        { action: 'replace', key: 'someProperty', value: 'woo' },
        { action: 'replace', key: 'otherProperty', value: { complex: true } },
      ]);
    
    });

    it('should replace arrays', function() {
    
      var left = {
        array: [ 'abc' ]
      };
      var right = {
        array: [ 'abc', 'def' ]
      };

      var diff = jsonDiff.deepDiff(left, right);

      diff.length.should.equal(1);
      diff.should.deepEqual([
        { action: 'replace', key: 'array', value: [ 'abc', 'def' ] },
      ]);
    
    });

    it('should return any additions', function() {
    
      var left = {
        someProperty: 'yay',
        otherProperty: 123
      };
      var right = {
        someProperty: 'yay',
        otherProperty: 123,
        newProperty: 'i am new'
      };

      var diff = jsonDiff.deepDiff(left, right);

      diff.length.should.equal(1);
      diff.should.deepEqual([
        { action: 'add', key: 'newProperty', value: 'i am new' },
      ]);
    
    });

  });

});
