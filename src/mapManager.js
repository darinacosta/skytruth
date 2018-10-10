const mapManager = {};
mapManager.map = new ol.Map({
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

mapManager.style = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 5,
    fill: new ol.style.Fill({ color: "rgb(36, 132, 101)" }),
    stroke: new ol.style.Stroke({
      color: "white",
      width: 1
    })
  })
});

mapManager.pinLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: mapManager.style,
  opacity: 0.7
});

mapManager.map.addLayer(mapManager.pinLayer);

mapManager.getMapCoords = () =>
  new Promise(res => {
    const coords = mapManager.map
      .getView()
      .calculateExtent(mapManager.map.getSize());

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
    const newCoords = [
      topLeft[1],
      topLeft[0],
      bottomRight[1],
      bottomRight[0]
    ].map(coord => {
      return coord.toFixed(2);
    });
    res(newCoords.toString());
  });

mapManager.addPoints = function(entries) {
  let features = [];
  for (let e of entries) {
    const feature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([e.lon, e.lat])),
      title: e.title,
      summary: e.summary
    });
    features.push(feature);
  }
  mapManager.pinLayer.getSource().addFeatures(features);
};

mapManager.displayFeatureInfo = pixel => {
  var feature = mapManager.map.forEachFeatureAtPixel(pixel, function(
    feature,
    layer
  ) {
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
};

mapManager.clear = () => {
  mapManager.pinLayer.getSource().clear();
};

setTimeout(() => {
  mapManager.map.on("pointermove", function(evt) {
    if (evt.dragging) {
      return;
    }
    const pixel = mapManager.map.getEventPixel(evt.originalEvent);
    mapManager.displayFeatureInfo(pixel);
  });

  mapManager.map.on("movestart", mapManager.clear);

  mapManager.map.on("moveend", init);
});
