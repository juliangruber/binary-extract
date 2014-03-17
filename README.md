
# binary-extract

  Extract a value from a buffer of json without parsing the whole thing.

  [![build status](https://secure.travis-ci.org/segmentio/binary-extract.png)](http://travis-ci.org/segmentio/binary-extract)

## Example

```js
var extract = require('binary-extract');

var buf = new Buffer(JSON.stringify({
  foo: 'bar',
  bar: 'baz',
  nested: {
    bar: 'nope'  
  } 
}));

var value = extract(buf, 'bar');
// => 'baz'
```

## Perf

  With the object from `bench.js`, `extract()` is ~2-4x faster than
  `JSON.parse(buf.toString())`. It is also way more memory efficient as the
  blob stays out of the V8 heap.

  The big perf gain comes mainly from not parsing everything and not
  converting the buffer to a string.

## Installation

```bash
$ npm install binary-extract
```

## API

### extract(buf, key)

  Extract the value of `key` in the json `buf`.

  The value can be any valid JSON structure.

## License

  MIT

