const dataManager = {
  entries: []
};

dataManager.xmlToJson = xml => {
  let obj = {};

  if (xml.nodeType == 1) {
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (let j = 0; j < xml.attributes.length; j++) {
        let attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    obj = xml.nodeValue;
  }
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      let item = xml.childNodes.item(i);
      let nodeName = item.nodeName;
      if (typeof obj[nodeName] == "undefined") {
        obj[nodeName] = dataManager.xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push == "undefined") {
          let old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(dataManager.xmlToJson(item));
      }
    }
  }
  if (obj.entry) {
    return dataManager.parseObjEntry(obj);
  }
  return obj;
};

dataManager.jsonToCsv = arr => {
  const Json2csvParser = json2csv.Parser;
  const json2csvParser = new Json2csvParser({ fields });
  const csv = json2csvParser.parse(arr);
  return csv;
};

dataManager.parseObjEntry = obj => {
  console.log("!!!OBJ", obj);
  if (!obj) {
    $("#count").text(0);
    return;
  }
  if (!obj.entry.length) {
    obj.entry = [obj.entry];
  }
  for (let o of obj.entry) {
    dataManager.entries.push({
      // content: o.content[`#text`],
      lat: parseFloat(o[`georss:point`][`#text`].split(" ")[0]),
      lon: parseFloat(o[`georss:point`][`#text`].split(" ")[1]),
      summary: o.summary[`#text`],
      title: o.title[`#text`],
      published: o.published[`#text`]
    });
  }
  dataManager.updateCountForm(dataManager.entries);
  return dataManager.entries;
};

dataManager.updateCountForm = entries => {
  $("#count").text(entries.length);
  csv = dataManager.jsonToCsv(entries);
  let data = new Blob([csv]);
  let a = document.getElementById("a");
  a.href = URL.createObjectURL(data);
};

dataManager.getSkyTruthData = bounds => {
  dataManager.entries = [];
  return fetch(
    `http://alerts.skytruth.org/rss?l=${bounds}&n=${maxFeatures}#rss`
  );
};
