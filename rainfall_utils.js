/**
 * 
 * This script is a demo to display 3 hourly precipitation estimates on a map.
 * 
 */


// load full dataset
var dataset = ee.ImageCollection("TRMM/3B42");
// pick precipitation
var precipitation = dataset.select('precipitation').filterDate('2018-11-28', '2018-11-28');

print( precipitation );

var visParams = {
  min: 0.0,
  max: 100,
  palette: [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
    '012E01', '011D01', '011301'
  ],
};
Map.setCenter(-69.43, 0.35, 3);
Map.addLayer(precipitation, visParams, 'precipitation');

// print( precipitation );

