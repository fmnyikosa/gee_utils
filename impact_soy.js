/**

This script puts together weather information from a particular region 
in the world for the purpose of analysing the weather impact on crops in that region.

@mandanji 25/Feb/2018


**/

// Get toolset
// var chart_util = require(); 

// Input paramters

// startDate = ;
// stopDate  = ;
// location  = ;

// Data Stuff



// UI Stuff




// Auxillary stuff

//================================ UI Components ==================================

// Title
var title = ui.Label('US Soybean Weather Impact Monitoring', {fontWeight: 'bold', fontSize: '24px'});
title.style().set('position', 'top-center');
Map.add(title);

// Rightpanel
// Add a title and some explanatory text to a side panel.
var header = ui.Label('Earthscope Demo', {fontSize: '24px', color: 'gray'});
var text = ui.Label(
    'US Croplands Visualization',
    {fontSize: '15px'});

var toolPanel = ui.Panel([header, text], 'flow', {width: '530px'});
ui.root.widgets().add(toolPanel);

// Add Chart UI

// Plot Landsat 8 band value means in a section of San Francisco and
// demonstrate interactive charts.

var sanFrancisco =
    ee.Geometry.Rectangle(-122.45, 37.74, -122.4, 37.8);

var landsat8Toa = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
    .filterDate('2015-12-25', '2016-12-25')
    .select('B[1-7]');

// Create an image time series chart.
var chart = ui.Chart.image.series({
  imageCollection: landsat8Toa,
  region: sanFrancisco,
  reducer: ee.Reducer.mean(),
  scale: 200
});

// Add the select to the toolPanel with some explanatory text.
toolPanel.add(ui.Label('Chart of extracted region monitoring data', {'font-size': '15px'}));

// Create a label on the map.
// var label = ui.Label('Click a point on the chart to show the image for that date.', {'font-size': '11px'});
// toolPanel.add(label);

// Add the chart to the map.
chart.style().set({
  position: 'bottom-right',
  width: '500px',
  height: '300px'
});
toolPanel.add(chart);

// Outline and center San Francisco on the map.
// var sfLayer = ui.Map.Layer(sanFrancisco, {color: 'FF0000'}, 'SF');
// Map.layers().add(sfLayer);
// Map.setCenter(-122.47, 37.7, 9);



// // When the chart is clicked, update the map and label.
// chart.onClick(function(xValue, yValue, seriesName) {
//   if (!xValue) return;  // Selection was cleared.

//   // Show the image for the clicked date.
//   var equalDate = ee.Filter.equals('system:time_start', xValue);
//   var image = ee.Image(landsat8Toa.filter(equalDate).first());
//   var l8Layer = ui.Map.Layer(image, {
//     gamma: 1.3,
//     min: 0,
//     max: 0.3,
//     bands: ['B4', 'B3', 'B2']
//   });

// Map.layers().reset([l8Layer, sfLayer]);

//   // Show a label with the date on the map.
// label.setValue((new Date(xValue)).toUTCString());
// });











