

var MAP_BASE = mmw._custom.MAP_BASE;
var mapId = mmw._custom.mapId;
var map = mmw.map;

map.on('load',  async () => {

	var geoJSONData = await mmw._common.fetchJSON(MAP_BASE + mapId + '/ITS22T10D.geojson');
	map.addSource('t10d', { 'type': 'geojson','data': geoJSONData });
	mmw._layer.addCircleLayer('t10d', ["/", 10000000, ['get', 'D22']], 'orange');
	
	var symbolLayer = newSymbolLayer('t10d', '', ['get','Name']);
	symbolLayer.paint['text-color'] = 'blue';
	map.addLayer(symbolLayer);

	var geoJSONData2 = await mmw._common.fetchJSON(MAP_BASE + mapId + '/ITS22T10F.geojson');
	map.addSource('t10f', { 'type': 'geojson','data': geoJSONData2 });
	mmw._layer.addCircleLayer('t10f', ["/", 100000, ['get', 'F22']], 'purple');
	
	mmw._layer.addSymbolLayer('t10f', '', ['get','Name']);

});