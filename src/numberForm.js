let maxFeatures = 100;
$("#maxFeatures").change(() => {
  maxFeatures = $("#maxFeatures").val() || 1;
  console.log("!!!maxFeatures", maxFeatures);
  init();
});
