
var extract = require('./');
var equal = require('assert').equal;

var buf = Buffer(JSON.stringify({
  foo: 'bar',
  bar: 'baz',
  beep: [
    { boop: true },
    { nice: 3 }
  ],
  boop: {
    some: {
      more: ['chunk']
    }
  },
  check: 'sweet'
}));

var cycles = 100000;

var start = Date.now();
for (var i = 0; i < cycles; i++) {
  var obj = JSON.parse(buf.toString('utf8'));
  equal(obj.check, 'sweet');
}

console.log('naive(): %s ms', Date.now() - start);

start = Date.now();
for (var i = 0; i < cycles; i++) {
  equal(extract(buf, 'check'), 'sweet');
}

console.log('extract(): %s ms', Date.now() - start);

