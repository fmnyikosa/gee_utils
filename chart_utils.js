
// create a timeseries chart
function timeseries(bandNames, imageCollection, startDate, stopDate, geom){
  /*
  bandNames = name of data layer(s) to chart (i.e. a string or list of strings)
  imageCollection = earth engine image collection
  startdate, stopDate = only use image between these dates
  geom = earth engine geometry
  */

  // select the data layers and time period we want
  var images = imageCollection
    .select(bandNames)
    .filterDate(startDate, stopDate);
  
  // create a chart object by taking the mean value inside the geometry
  return ui.Chart.image.series(images, geom, ee.Reducer.mean())
}

// EXPORT to other modules
// to make a function importable elsewhere
// we need to add it as a property in exports 
exports.timeseries = timeseries