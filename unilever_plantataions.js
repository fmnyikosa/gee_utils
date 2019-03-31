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

// Map.addLayer(region)
// Map.addLayer(sites, {color:'red'})

exports.sites = sites
exports.region = region