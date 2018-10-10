var map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM({
        url: "http://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
      })
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-90.4123, 29.9991]),
    zoom: 10
  })
});

function getMapCoords() {
  const coords = map.getView().calculateExtent(map.getSize());
  const topLeft = ol.proj.transform(
    [coords[0], coords[1]],
    "EPSG:3857",
    "EPSG:4326"
  );
  const bottomRight = ol.proj.transform(
    [coords[2], coords[3]],
    "EPSG:3857",
    "EPSG:4326"
  );
  const newCoords = [topLeft[1], topLeft[0], bottomRight[1], bottomRight[0]];
  addPoints(entries);
  return newCoords;
}

function addPoints(entries) {
  let features = [];
  for (let e of entries) {
    const feature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([e.lon, e.lat])),
      title: e.title,
      summary: e.summary
    });

    feature.style = style;
    features.push(feature);
  }
  const pinLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: features
    })
  });
  map.addLayer(pinLayer);
}

function displayFeatureInfo(pixel) {
  var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    return feature;
  });
  if (feature) {
    var text = feature.get("title");
    info.innerHTML = text;
    target.style.cursor = "pointer";
  } else {
    info.innerHTML = "...";
    target.style.cursor = "";
  }
}

map.on("pointermove", function(evt) {
  if (evt.dragging) {
    return;
  }
  const pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel);
});

function init() {
  boundingBox = getMapCoords().toString();
  getSkyTruthData();
  $("#coords").html(
    `<a href="http://alerts.skytruth.org/rss?l=${boundingBox}#rss" target="_blank">${boundingBox}</a>`
  );
}

map.on("moveend", init);

setTimeout(() => {
  $(".ol-zoom-out").text("-");
  init();
}, 1000);
