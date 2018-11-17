/**
The Cropland Data Layer (CDL) is a crop-specific land cover data layer
created annually for the continental United States

**/


function cropNumber(cropname, cropland){
  // Find pixel value assigned to target crop
  
  // list all cropnames
  var cropnames = ee.List(cropland.get('cropland_class_names'))
  
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
  var CDL = ee.ImageCollection('USDA/NASS/CDL')
  
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
cropMap('Soybeans', '2017')  

//=========================== UI Additions =====================================

// 1. Title 
var title = ui.Label('Croplands in USA');
title.style().set('position', 'top-center');
Map.add(title);

// left panel with ES logo
 


