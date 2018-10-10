let maxFeatures = 100;
$("#maxFeatures").change(() => {
  maxFeatures = $("#maxFeatures").val() || 1;
  init();
});
