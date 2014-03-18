
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
 * Extract the value of `key` in the json `buf`.
 *
 * @param {Buffer} buf
 * @param {String} key
 * @return {Mixed}
 * @api public
 */

function extract(buf, key){
  var isKey = true;
  var inString = false;
  var level = 0;
  var chars = strToCharCodes(key);
  var c;

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
    if (!isKey || level > 1 || !isMatch(buf, i, chars)) continue;

    var start = i + key.length + 2;
    var end = findEnd(buf, start);

    return parse(buf, start, end);
  }
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
 * Check if `buf[i+n]` equals `chars`.
 *
 * @param {Array[Number]} chars
 * @param {Buffer} buf
 * @param {Number} i
 * @return {Boolean}
 * @api private
 */

function isMatch(buf, i, chars){
  for (var j = 0; j < chars.length; j++) {
    if (buf[i + j] != chars[j]) return false;
  }
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

