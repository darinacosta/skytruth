init = () => {
  mapManager.getMapCoords().then(bounds => {
    mapManager.clear();
    const entries = dataManager
      .getSkyTruthData(bounds)
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
      .then(data => {
        const points = dataManager.xmlToJson(data).feed;
        mapManager.addPoints(points);
        $("#coords").html(
          `<a href="http://alerts.skytruth.org/rss?l=${bounds}#rss" target="_blank">${bounds}</a>`
        );
      });
  });
};

setTimeout(() => {
  $(".ol-zoom-out").text("-");
}, 1000);
