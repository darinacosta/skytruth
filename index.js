const entries = [];
let csv = null;
const boundingBox = "29.3841,-91.4996,30.9277,-89.577";
const fields = ["lat", "lon", "published", "summary", "title"];

function xmlToJson(xml) {
  var obj = {};

  if (xml.nodeType == 1) {
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    obj = xml.nodeValue;
  }
  if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof obj[nodeName] == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  if (obj.entry) {
    parseObjEntry(obj);
  }
  return obj;
}

function jsonToCsv(arr) {
  const Json2csvParser = json2csv.Parser;
  const json2csvParser = new Json2csvParser({ fields });
  const csv = json2csvParser.parse(arr);
  return csv;
}

function parseObjEntry(obj) {
  for (let o of obj.entry) {
    entries.push({
      // content: o.content[`#text`],
      lat: parseFloat(o[`georss:point`][`#text`].split(" ")[0]),
      lon: parseFloat(o[`georss:point`][`#text`].split(" ")[1]),
      summary: o.summary[`#text`],
      title: o.title[`#text`],
      published: o.published[`#text`]
    });
  }
  csv = jsonToCsv(entries);
  var data = new Blob([csv]);
  var a = document.getElementById("a");
  a.href = URL.createObjectURL(data);
}

function getSkyTruthData(location) {
  return fetch(`http://alerts.skytruth.org/rss?l=${boundingBox}#rss`)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      const json = xmlToJson(data);
    });
}

getSkyTruthData();
