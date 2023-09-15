
setType('satellite');

document.title = 'India - Middle East - Europe Corridor';
document.getElementsByTagName('link')[0].href = MAP_BASE + mapId + '/img/ship.png';

var url = './view?type=basic&view=inset&src='+MAP_BASE + mapId + '/data/city.json,'+ MAP_BASE + mapId + '/data/route.json#1.75/30/50';
loadInset(url);

var zoom = 5.5;

if(map.getCanvasContainer().offsetWidth < 640) {
	insetEl.style.width = '75%';
	headerEl.style.width = '50px';
	headerEl.children[1].style.display = 'none';
	zoom = 3.5;
}

map.flyTo({ center : [66,22], zoom : zoom, pitch : 60}); // India
//map.flyTo({ center : [60,30], zoom : zoom, pitch : 60}); // IMEC


setTimeout( async function() {
	var count = 0;
	var geoJSONData2 = await fetchJSON(MAP_BASE + mapId + '/data/region.json');

	geoJSONData2.features.forEach( (f) => {
		if(count > 0 ) {
			let vr = document.createElement('hr');
			vr.classList.add('vr');
			bottombarEl.append(vr);
		}

		let titleEl = document.createElement('div');
		titleEl.append(f.properties.name);
		titleEl.style.margin = '15px';
		titleEl.setAttribute('onclick', 'map.flyTo({ center : ['+ f.geometry.coordinates +'], zoom : '+zoom+', pitch : 60})');
		bottombarEl.append(titleEl);
		count++;
	});

	bottombarEl.style.display = 'flex';
	bottombarEl.style.width = '251px';
	if(map.getCanvasContainer().offsetWidth < 640) {
		bottombarEl.style.right = '15%'
	} else {
		bottombarEl.style.right = '40%'
	}
});

map.on('load', async function() {

	var geoJSONData = await fetchJSON(MAP_BASE + mapId + '/data/city.json');
	map.addSource('city', { 'type': 'geojson','data': geoJSONData });
	addSymbolLayer('city', 'pin', ['format', ['get', 'city'], ' \n ', ['get', 'country'] ]);

	var geoJSONData1 = await fetchJSON(MAP_BASE + mapId + '/data/route.json');
	map.addSource('route', { 'type': 'geojson','data': geoJSONData1 });
	addLineLayer('route', '', 10);

});