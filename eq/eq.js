

var map = mmw.map;

//mmw.map.flyTo({ center : [0,0], zoom : 1 } );

mmw.map.flyTo({ center : [-125, 45], zoom : 3.5, pitch: 45 } );

map.on('load',  async () => {

	var DATA_URL = '../maps/eq/earthquakes2d.geojson';
	var response = await fetch(DATA_URL);
	var data = await response.json();
	
	map.addSource('earthquakes', { 'type': 'geojson', 'data': data });
	
	// heatmap
	//mmw._layer.addHeatmapLayer('earthquakes', ['get', 'mag']);
	
	// 3d heatmap
	mmw._layer.addHexagonLayer(data.features.map(f => f.geometry.coordinates), 10000, true);

	// bubble
	//mmw._layer.addBubbleLayer('earthquakes', ['get', 'mag']);
	
	// 3d-scatter
	//map.addSource('earthquakes3d', { 'type': 'geojson', 'data':'../maps/eq/earthquakes3d.geojson' });
	//mmw._layer.addExtrusionLayer('earthquakes3d', 'lightgrey', .7,  ['*', 1000, ['get', 'height'] ]);

	
});