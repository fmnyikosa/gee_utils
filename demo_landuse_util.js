/**
 * 
 * This script is a demo to display global land cover.
 * 
 */


// load full dataset
var dataset    = ee.ImageCollection("MODIS/051/MCD12Q1");
// pick precipitation
var land_cover = dataset.select('Land_Cover_Type_1').filterDate('2012-01-01', '2013-01-01');

print( land_cover );

var visParams  = {
  min: 0,
  max: 254,
  palette: [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
    '012E01', '011D01', '011301'
  ],
};
Map.setCenter(-69.43, 0.35, 3);
Map.addLayer(land_cover , visParams, 'Land Cover Type 1');

// print( precipitation );

