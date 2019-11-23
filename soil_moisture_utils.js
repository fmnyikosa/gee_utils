var gldas = ee.ImageCollection('NASA/GLDAS/V021/NOAH/G025/T3H')
  .filterDate('2018-06-01', '2019-01-01')
  
var image = ee.Image(gldas.first())

var root_moisture = image.select('RootMoist_inst')
var soil_moisture_0_10cm = image.select('SoilMoi0_10cm_inst')
var soil_moisture_10_40cm = image.select('SoilMoi10_40cm_inst')
var soil_moisture_40_100cm = image.select('SoilMoi40_100cm_inst')
var soil_moisture_100_200cm = image.select('SoilMoi100_200cm_inst')

var palette = ['502d16','b0dfe5', '0080ff','010080']
var palette = ['654321','0080ff']
var palette = ['e1c8aa','cd9762','87c2ff','0077f1']

Map.addLayer(soil_moisture_100_200cm, {min:0, max:400, palette:palette}, '100_200cm')
Map.addLayer(soil_moisture_40_100cm, {min:0, max:200, palette:palette}, '40_100cm')
Map.addLayer(soil_moisture_10_40cm, {min:0, max:100, palette:palette}, '10_40cm')
Map.addLayer(soil_moisture_0_10cm, {min:0, max:50, palette:palette}, '0_10cm')
Map.addLayer(root_moisture, {min:0, max:1000, palette:palette}, 'root_zone_moisture')

Map.addLayer(plantations.sites, {color:'red'})