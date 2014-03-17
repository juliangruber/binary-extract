
var assert = require('assert');
var equal = assert.equal;
var extract = require('./');

var obj = {
  foo: 'bar',
  bar: 3,
  baz: {
    beep: 'boop'
  }
}
var buf = Buffer(JSON.stringify(obj));

describe('extract(buf, key)', function(){
  it('should extract a value', function(){
    equal(extract(buf, 'foo'), 'bar');
  })
})

