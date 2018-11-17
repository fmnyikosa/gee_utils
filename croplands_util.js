/**
The Cropland Data Layer (CDL) is a crop-specific land cover data layer
created annually for the continental United States

**/


function cropNumber(cropname, cropland){
  // Find pixel value assigned to target crop
  
  // list all cropnames
  var cropnames = ee.List(cropland.get('cropland_class_names'))
  //print(cropnames)
  
  // return location of the crop we are looking for
  // (i.e. this index corresponds to the pixel value for target crop)
  return cropnames.indexOf(cropname)
}

function cropBand(cropland, value){
  // returns a binary image where 1 = target crop and 0 = everything else
  return cropland.eq(value)
}

function cropColor(cropland, value){
  // return original color used for target crop
  
  // list all colors
  var colors = ee.List(cropland.get('cropland_class_palette'))
  
  // get the color for this pixel value (which is the same as the index in the list)
  var color = colors.get(value).getInfo()
  return color
}

function displayCrop(cropname, cropland, year){
  // This function displays a single crop type on the map
  // It displays the target crop in its original color
  // and all other crops in grey
  
  // Find the pixel value for this crop 
  var value = cropNumber(cropname, cropland)
  
  // Create a binary classification image for this specific crop
  var targetCrop = cropBand(cropland, value)
  
  // Find the original color for this crop
  var targetColor = cropColor(cropland, value)
  
  // Display the target crop in its original color and everything else in grey
  Map.addLayer(targetCrop,{'palette':['cccccc' ,targetColor]},cropname+'_'+year)
  
  // Helpful HACKS..
  
  // Calculate total acreage
  // var numPixels = targetCrop.reduceRegion({
  //   'reducer':ee.Reducer.sum(),
  //   'maxPixels':20E9
  //   })

  // Give hint if valid cropname was not given (this is a hack)
  if (value.getInfo() === -1){
    print('Crop type not found "'+cropname+'" !')
    print('.. try capitalize first letter?')
  }
}

function cropMap(cropname, year){
  // Cropland Data Layer (CDL)
  
  
  // Crops for a given year
  var CDL_thisYear = ee.Image(CDL.filterDate(year+'-01-01').first())
  
  // select all cropland (CDL images also contain 'cultivated' and 'confidence' bands)
  var cropland = CDL_thisYear.select('cropland')

  //  display all cropland
  if (cropname === 'All') {
    // This will add the entire cropland data set for this year to the map
    // It is a single image with just one 8-bit band
    // The pixel numbers correspond to a particular crop (e.g. 0 = Corn)
    // The colors to visualize the pixels are from a predefined 'palette'
    // so we can just add it as a layer on the map..
    Map.addLayer(cropland, {}, 'All Cropland')
    
  //  display target crop
  } else {
    // Visualize a single crop type
    displayCrop(cropname, cropland, year)
  }
  
  // center the map on the dataset to zoom level 4 (i.e. all of USA)
  Map.centerObject(cropland, 4)
  
}


// Map all crops ('All') or a specific target crop (e.g. 'Corn')
cropMap('Corn', '2017')



//================================ UI Components ==================================

// Title
var title = ui.Label('US Croplands Monitoring', {fontWeight: 'bold', fontSize: '24px'});
title.style().set('position', 'top-center');
Map.add(title);

// Footer
// var logo   = ui.Label('Earthscope Demo', {fontSize: '24px', color: 'gray'});
// var footer = ui.Panel( [logo], 'flow', {width: '10%'});
// footer.style().set('position', 'bottom-left');
// Map.add(footer);

//Rightpanel
// Add a title and some explanatory text to a side panel.
var header = ui.Label('Earthscope Demo', {fontSize: '24px', color: 'gray'});
var text = ui.Label(
    'US Croplands Visualization',
    {fontSize: '15px'});

var toolPanel = ui.Panel([header, text], 'flow', {width: '530px'});
ui.root.widgets().add(toolPanel);

// Create a layer selector pulldown.
var cropnames   = {
  'Corn':'Corn',
  'Soybeans':'Soybeans'
  //'All':'All'
}
var selectItems = Object.keys(cropnames);
//print(selectItems)

// Define the pulldown menu.  Changing the pulldown menu changes the map layer
var layerSelect = ui.Select({
  items: selectItems,
  value: selectItems[0],
  onChange: function(selected) {
    cropMap(selected, '2017')
  }
});

// Add the select to the toolPanel with some explanatory text.
toolPanel.add(ui.Label('Select cropland to view', {'font-size': '11px'}));
toolPanel.add(layerSelect);


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
var label = ui.Label('Click a point on the chart to show the image for that date.', {'font-size': '11px'});
toolPanel.add(label);

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



// When the chart is clicked, update the map and label.
chart.onClick(function(xValue, yValue, seriesName) {
  if (!xValue) return;  // Selection was cleared.

  // Show the image for the clicked date.
  var equalDate = ee.Filter.equals('system:time_start', xValue);
  var image = ee.Image(landsat8Toa.filter(equalDate).first());
  var l8Layer = ui.Map.Layer(image, {
    gamma: 1.3,
    min: 0,
    max: 0.3,
    bands: ['B4', 'B3', 'B2']
  });
  Map.layers().reset([l8Layer, sfLayer]);

  // Show a label with the date on the map.
  label.setValue((new Date(xValue)).toUTCString());
});
