
module.exports = extract;

var comma = ','.charCodeAt(0);

function extract(buf, key){
  for (var i = 0; i < buf.length; i++) {
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
    for (var j = start; j < buf.length; j++) {
      if (buf[j] == comma) {
        end = j;
        break;
      }
    }

    var json = buf.toString('utf8', start, end);
    return JSON.parse(json);
  }
}

