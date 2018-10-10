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
  return newCoords;
}

map.on("moveend", function() {
  boundingBox = getMapCoords().toString();
  getSkyTruthData();
  $("#coords").text(boundingBox);
});
