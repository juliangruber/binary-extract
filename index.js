
/**
 * Expose `extract`.
 */

module.exports = extract;

/**
 * Char codes.
 */

var comma = code(',');
var obrace = code('{');
var cbrace = code('}');
var obracket = code('[');
var cbracket = code(']');
var colon = code(':');
var mark = code('"');
var backslash = code('\\');

/**
 * Extract the value of `keys` in the json `buf`.
 *
 * If `keys` is a single key, returns the value.
 * If `keys` is an array of keys, returns an array of values.
 *
 * @param {Buffer} buf
 * @param {Array|String} keys
 * @return {Mixed}
 * @api public
 */

function extract(buf, keys){
  if (!Array.isArray(keys)) keys = [keys];

  var values = [];
  var matched = {};
  var isKey = true;
  var inString = false;
  var level = 0;
  var chars = keys.map(strToCharCodes);
  var c;
  var match;
  var start;
  var end;

  for (var i = 0; i < buf.length; i++) {
    c = buf[i];

    if (c == backslash) {
      i++;
      continue;
    }

    if (c == mark) {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (c == colon) isKey = false;
      else if (c == comma) isKey = true;
      else if (c == obrace) level++;
      else if (c == cbrace) level--;
    }
    if (!isKey || level > 1) continue;

    for (var j = 0; j < keys.length; j++) {
      if (!matched[keys[j]] && isMatch(buf, i, chars[j])) {
        match = {
          key: keys[j],
          chars: chars[j],
          idx: j
        };
        matched[keys[i]] = true;
        break;
      };
    }
    if (!match) continue;

    start = i + match.key.length + 2;
    end = findEnd(buf, start);

    values[match.idx] = parse(buf, start, end);
    match = null;
    if (values.length == keys.length) break;
  }

  return keys.length == 1
    ? values[0]
    : values;
}

/**
 * Get the char code of `str`.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function code(str) {
  return str.charCodeAt(0);
}

/**
 * Convert `str` to an array of char codes.
 *
 * @param {String} str
 * @return {Array[Number]}
 * @api private
 */

function strToCharCodes(str) {
  var chars = [];
  for (var i = 0; i < str.length; i++) {
    chars[i] = str.charCodeAt(i);
  }
  return chars;
}

/**
 * Check if `buf[i-1] - buf[i+n]` equals `"chars"`.
 *
 * @param {Array[Number]} chars
 * @param {Buffer} buf
 * @param {Number} i
 * @return {Boolean}
 * @api private
 */

function isMatch(buf, i, chars){
  if (buf[i - 1] != mark) return false;
  for (var j = 0; j < chars.length; j++) {
    if (buf[i + j] != chars[j]) return false;
  }
  if (buf[i + chars.length] != mark) return false;
  return true;
}

/**
 * Find the end index of the object
 * that starts at `start` in `buf`.
 *
 * @param {Buffer} buf
 * @param {Number} start
 * @return {Number}
 * @api private
 */

function findEnd(buf, start) {
  var level = 0;
  var s = buf[start];
  var c;

  for (var i = start; i < buf.length; i++) {
    c = buf[i];
    if (c == obrace || c == obracket) {
      level++;
      continue;
    } else if (c == cbrace || c == cbracket) {
      if (--level > 0) continue;
    }
    if (
      level < 0
      || level == 0 && (c == comma || c == cbrace || c == cbracket)
    ) {
      return s == obrace || s == obracket
        ? i + 1
        : i;
    }
  }
}

/**
 * Parse the json in `buf` from `start` to `end`.
 *
 * @param {Buffer} buf
 * @param {Number} start
 * @param {Number} end
 * @return {Mixed}
 * @api private
 */

function parse(buf, start, end) {
  var json = buf.toString('utf8', start, end);
  return JSON.parse(json);
}

