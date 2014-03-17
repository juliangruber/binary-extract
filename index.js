
module.exports = extract;

var comma = ','.charCodeAt(0);
var obrace = '{'.charCodeAt(0);
var cbrace = '}'.charCodeAt(0);
var obracket = '['.charCodeAt(0);
var cbracket = ']'.charCodeAt(0);
var colon = ':'.charCodeAt(0);
var mark = '"'.charCodeAt(0);

function extract(buf, key){
  var isKey = true;
  var inString = false;
  var level = 0;
  var chars = strToCharCodes(key);

  for (var i = 0; i < buf.length; i++) {
    if (buf[i] == mark) {
      inString = !inString;
      continue;
    }

    if (!inString) {
      switch (buf[i]) {
        case colon: isKey = false; break;
        case comma: isKey = true; break;
        case obrace: level++; break;
        case cbrace: level--; break;
      }
    }
    if (!isKey || level > 1 || !isMatch(chars, buf, i)) continue;

    var start = i + key.length + 2;
    var end = findEnd(start, buf);

    return deserialize(buf, start, end);
  }
}

function findEnd(start, buf) {
  var c;
  var level = 0;

  for (var i = start; i < buf.length; i++) {
    c = buf[i];
    if (c == obrace || c == obracket) level++;
    else if (c == cbrace || c == cbracket) level--;
    if (level > 0) continue;
    if (c == comma || c == cbrace || c == cbracket) {
      var end = i;
      if (buf[start] == obrace || buf[start] == obracket) end++;
      return end;
    }
  }
}

function deserialize(buf, start, end) {
  var json = buf.toString('utf8', start, end);
  if (json[0] == '"') return json.substr(1, json.length - 2);
  return JSON.parse(json);
}

function strToCharCodes(str) {
  var chars = [];
  for (var i = 0; i < str.length; i++) {
    chars.push(str.charCodeAt(i));
  }
  return chars;
}

function isMatch(chars, buf, i){
  var match = true;
  for (var j = 0; j < chars.length; j++) {
    if (buf[i + j] != chars[j]) {
      match = false;
      break;
    }
  }
  return match;
}
