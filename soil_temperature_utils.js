// imports
var region = ee.Geometry.Rectangle([105.12689545509443,-8.31130269007929, 109.30170014259443,-4.687904936978911])

var feature_1 = ee.Feature(ee.Geometry.Point(105.605126, -5.298086), {
    'country': 'Indonesia', 
    'island': 'Sumatra', 
    'province': 'Lampung'
  });
var feature_2 = ee.Feature(ee.Geometry.Point(106.454232, -7.336314), {
    'country': 'Indonesia', 
    'island': 'Java', 
    'province': 'Sukabumi'
  });
var feature_3 = ee.Feature(ee.Geometry.Point(108.450878, -7.757790), {
    'country': 'Indonesia', 
    'island': 'Java', 
    'province': 'Pangandaran'
  });

var sites = ee.FeatureCollection([feature_1, feature_2, feature_3])

/////////



var sites = ee.FeatureCollection(plantations.sites)
var geom = ee.Feature(sites.first()).geometry()

// Function to cloud mask from the pixel_qa band of Landsat 8 SR data.
function maskL8sr(image) {
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = 1 << 3;
  var cloudsBitMask = 1 << 5;

  // Get the pixel QA band.
  var qa = image.select('pixel_qa');

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
      .and(qa.bitwiseAnd(cloudsBitMask).eq(0));

  // Return the masked image, scaled to TOA reflectance, without the QA bands.
  return image.updateMask(mask).divide(10000)
      .select("B[0-9]*")
      .copyProperties(image, ["system:time_start"]);
}

function L8sr(image){
  // Return TOA reflectance
  return image.divide(10000)
      .select("B[0-9]*")
      .copyProperties(image, ["system:time_start"]);
}

// Map the function over one year of data.
var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
    .filterDate('2016-02-01', '2016-12-31')
    .filterBounds(geom)
    .map(maskL8sr)
    // .map(L8sr)

var image = collection.first();
var rgb = image.select(['B4', 'B3', 'B2'])
var ndvi = image.normalizedDifference(['B5', 'B4'])

// Display the results.
Map.addLayer(rgb, {min: 0, max: 0.3}, 'rgb');
Map.addLayer(ndvi, {min:0.0, max:1, palette:['red','yellow','green']}, 'ndvi')

// Map.addLayer(plantations.region)
Map.addLayer(geom, {color:'red'})
// Map.centerObject(geom,12)

Export.image.toDrive({image:rgb, fileNamePrefix:'rgb', scale:30})
Export.image.toDrive({image:ndvi, fileNamePrefix:'ndvi', scale:30})