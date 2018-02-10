
# binary-extract

  Extract one or more values from a buffer of json without parsing the whole thing.

  [![build status](https://secure.travis-ci.org/juliangruber/binary-extract.png)](http://travis-ci.org/juliangruber/binary-extract)

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

var values = extract(buf, ['foo', 'nested'])
// => ["bar", {"bar":"nope"}]
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

### extract(buf, keys)

  Extract the value of `keys` in the json `buf`.

  The value can be any valid JSON structure.

  If `keys` is a __String__, returns a value. If `keys` is an __Array__ of
  keys, returns an array of values.

## Sponsors

This module is proudly supported by my [Sponsors](https://github.com/juliangruber/sponsors)!

Do you want to support modules like this to improve their quality, stability and weigh in on new features? Then please consider donating to my [Patreon](https://www.patreon.com/juliangruber). Not sure how much of my modules you're using? Try [feross/thanks](https://github.com/feross/thanks)!

## License

  MIT

