
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
    if (!isKey || level > 1) continue;

    var match = true;
    for (var j = 0; j < key.length; j++) {
      if (buf[i + j] != key.charCodeAt(j)) {
        match = false;
        break;
      }
    }
    if (!match) continue;

    var start = i + key.length + 2;
    var end;
    level = 0;
    for (var j = start; j < buf.length; j++) {
      switch (buf[j]) {
        case obrace:
        case obracket:
          level++; break;
        case cbrace:
        case cbracket:
          level--; break;
      }
      if (level > 0) continue;
      if (buf[j] == comma || buf[j] == cbrace || buf[j] == cbracket) {
        end = j;
        if (buf[start] == obrace || buf[start] == obracket) end++;
        break;
      }
    }

    var json = buf.toString('utf8', start, end);
    return JSON.parse(json);
  }
}

