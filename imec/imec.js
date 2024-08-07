
var MAP_BASE = mmw._custom.MAP_BASE;
var mapId = mmw._custom.mapId;

var map = mmw.map;

var headerEl = mmw._overlay.headerEl;
var rightheaderEl = mmw._overlay.rightheaderEl;
var bottombarEl = mmw._overlay.bottombarEl;

mmw._common.setType('satellite');
//mmw._common.setType('none');

var routes;

document.title = 'India - Middle East - Europe Corridor';
document.getElementsByTagName('link')[0].href = MAP_BASE + mapId + '/img/ship.png';

var url = './view?type=basic&view=inset&src='+MAP_BASE + mapId + '/data/city.json,'+ MAP_BASE + mapId + '/data/route.json#1.75/30/50';
var insetEl = mmw._overlay.loadInset(url);

var zoom = 5;
var pitch = 75;

if(map.getCanvasContainer().offsetWidth < 640) {
	insetEl.style.width = '75%';
	headerEl.style.width = '50px';
	headerEl.children[1].style.display = 'none';
	zoom = 3.5;
}

map.flyTo({ center : [60,30], zoom : 3.5, pitch : 60});

var geoJSONData = [];

setTimeout( async function() {
	var count = 0;
	geoJSONData[2] = await mmw._common.fetchJSON(MAP_BASE + mapId + '/data/region.json');

	geoJSONData[2].features.forEach( (f) => {

		if(count > 0 ) {
			let vr = document.createElement('hr');
			vr.classList.add('vr');
			bottombarEl.append(vr);
		}

		let titleEl = document.createElement('div');
		titleEl.append(f.properties.name);
		titleEl.style.margin = '15px';
		titleEl.setAttribute('onclick', 'map.flyTo({ center : ['+ f.geometry.coordinates +'], zoom : '+zoom+', pitch : '+pitch+'})');
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

	geoJSONData[0] = await mmw._common.fetchJSON(MAP_BASE + mapId + '/data/city.json');
	map.addSource('city', { 'type': 'geojson','data': geoJSONData[0] });
	var cityLayer = newSymbolLayer('city', 'pin', ['format', ['get', 'city'], ' \n ', ['get', 'country'] ]);
	cityLayer.paint = {'text-color' : 'white' };
	map.addLayer(cityLayer);

	geoJSONData[1] = await mmw._common.fetchJSON(MAP_BASE + mapId + '/data/route.json');
	map.addSource('route', { 'type': 'geojson','data': geoJSONData[1] });
	mmw._layer.addLineLayer('route', '', 10);

	routes = geoJSONData[1].features;
	//map.terrain.exaggeration = 25;
	
	map.addLayer(newThreeJSLayer(mmw._router.moveObject));
	
	loader3js.load( MAP_BASE + mapId + '/asset/container_ship.glb', (model) => {
			model.scene.scale.set(10000, 10000, 10000);
			model.scene.rotation.x = 90 * Math.PI/180;
			mmw._router.objects['container_ship'] = model;
		}	
	);
		
	loader3js.load( MAP_BASE + mapId +'/asset/train_engine.glb', (model) => {
			model.scene.scale.set(50000, 50000, 50000);
			model.scene.rotation.x = 90 * Math.PI/180;
			mmw._router.objects['train_engine'] = model;
		}
	);

});