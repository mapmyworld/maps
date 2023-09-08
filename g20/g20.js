
var navId = params.get('nav');

document.title = 'G20 World Map';
document.getElementsByTagName('link')[0].href = MAP_BASE + mapId + '/img/g20-xxxs.png';

map.setZoom(3.5);
map.setPitch(45);

rightheaderEl.style.display = 'flex';
rightheaderEl.firstElementChild.src = MAP_BASE + mapId + '/img/g20-lg.png';

if(map.getCanvasContainer().offsetWidth > 640) {
	middleheaderEl.style.display = 'flex';
	middleheaderEl.firstElementChild.src = MAP_BASE + mapId + '/img/g20-vk-dark.png';
} else {
	headerEl.style.width = '50px';
	headerEl.children[1].style.display = 'none';
}

if(!navId) {
	
	map.flyTo({center: [80,22] });

	rightbarEl.style.display = 'grid';

	var noOfList = 3;
	var titleHeight = (35 * noOfList) + 40;
	
	let rightbarListTitleEl = document.createElement('div');
	rightbarListTitleEl.append('Members');
	rightbarEl.append(rightbarListTitleEl);

	let rightbarListEl = document.createElement('ol');
	rightbarListEl.classList.add('rightbarlist');
	rightbarEl.append(rightbarListEl);

	rightbarEl.append(document.createElement('hr'));

	let rightbarList2TitleEl = document.createElement('div');
	rightbarList2TitleEl.append('Invitees');
	rightbarEl.append(rightbarList2TitleEl);

	var rightbarList2El = document.createElement('ol');
	rightbarList2El.classList.add('rightbarlist');
	rightbarEl.append(rightbarList2El);

	rightbarEl.append(document.createElement('hr'));

	let rightbarList3TitleEl = document.createElement('div');
	rightbarList3TitleEl.append('Host Cities');
	rightbarEl.append(rightbarList3TitleEl);

	var rightbarList3El = document.createElement('ol');
	rightbarList3El.classList.add('rightbarlist');
	rightbarEl.append(rightbarList3El);
	
	rightbarEl.append(document.createElement('hr'));
	
	let rightbarList4TitleEl = document.createElement('div');
	rightbarList4TitleEl.append('Traffic Control');
	rightbarEl.append(rightbarList4TitleEl);
	rightbarList4TitleEl.setAttribute('onclick','setNav("traffic")');
	rightbarList4TitleEl.classList.add('nolist');

	rightbarListHeight = (rightbarEl.clientHeight -  titleHeight ) / noOfList;

	makeCollapsible(rightbarListTitleEl);
	makeCollapsible(rightbarList2TitleEl);
	makeCollapsible(rightbarList3TitleEl);

	//collapse(rightbarListTitleEl);
	//collapse(rightbarList2TitleEl);
	//collapse(rightbarList3TitleEl);

	var popupFn = function leaderInfo(e) {
		var feature = e.features[0];
		if(feature.properties.leader) {
			return '<div style="width: 100px"><center> <b>' + feature.properties.designation + '</b>' + ' <hr> <br> <img style="height:50px" src="'+ MAP_BASE + mapId + '/img/leader/' + feature.properties.name + '.png"> </img> <br>' + feature.properties.leader + '</center></div>' ;
		}
	};
	
	map.loadImage( MAP_BASE + mapId + '/img/g20-xxxs.png', async (error, image) => {
			if (error) throw error;
			map.addImage('host', image);
		}
	);
	
	let geoJSONData = [];
	
	map.on('load',  async () => {
	
		geoJSONData[0] = await fetchJSON(MAP_BASE + mapId + '/data/host.json');
		map.addSource('host', { 'type': 'geojson', 'data': geoJSONData[0],
			"attribution" : 'Source <a href="https://g20.org">G20</a>'
		});
		var symbolLayer = newSymbolLayer('host', 'host', ['format', ['get', 'name'], ' \n ', ['get', 'summit'] ]);
		symbolLayer.layout['text-offset'] = [2,.5];
		map.addLayer(symbolLayer);
		enablePopup('host', popupFn);
		
		geoJSONData[1] = await fetchJSON(MAP_BASE + mapId + '/data/member.json');
		map.addSource('member', { 'type': 'geojson','data': geoJSONData[1] });
		addSymbolLayer('member', 'pin', ['format', ['get', 'name'], ' \n ', ['get', 'summit'] ], popupFn);
				
		geoJSONData[2] = await fetchJSON(MAP_BASE + mapId + '/data/invitee.json');
		map.addSource('invitee', { 'type': 'geojson','data': geoJSONData[2] });
		addSymbolLayer('invitee', 'pin-blue', ['get', 'name'], popupFn);
		
		geoJSONData[3] = await fetchJSON(MAP_BASE + mapId + '/data/city.json');
		
		populateUI(geoJSONData);
		
	});
	
	function populateUI(geoJSONData) {
	
		var memberEl = document.createElement('li');
		memberEl.innerHTML = '<img class="logo" src="' + MAP_BASE + mapId + '/img/flag/India.png"></img>India ( Host )';
		memberEl.setAttribute('onclick','map.flyTo({ zoom: 3.5, center: [80,22] });');
		rightbarListEl.prepend(memberEl);
		
		geoJSONData[1].features.forEach( (f) => {
			var memberEl = document.createElement('li');
			memberEl.innerHTML = '<img class="logo" src="'+ MAP_BASE + mapId + '/img/flag/'+f.properties.name+'.png"</img>' + f.properties.name;
			memberEl.setAttribute('onclick','map.flyTo({ zoom: 4.5, center: ['+ f.geometry.coordinates +'] })');
			rightbarListEl.append(memberEl);
		});

		geoJSONData[2].features.forEach( (f) => {
			var memberEl = document.createElement('li');
			memberEl.innerHTML = '<img class="logo" src="' + MAP_BASE + mapId + '/img/flag/'+f.properties.name+'.png"</img>' + f.properties.name;
			memberEl.setAttribute('onclick','map.flyTo({ zoom: 4.5, center: ['+ f.geometry.coordinates +'] })');
			rightbarList2El.appendChild(memberEl);
		});
		
		geoJSONData[3].features.forEach( (f) => {
			var memberEl = document.createElement('li');
			memberEl.innerHTML = f.properties.city;
			var popupHTML = '<div style="width: 175px"><center> <b>Nearest Airport</b><hr> <img style="width:20px" src="img/flight_takeoff.jpg"> </img>' + f.properties.nearestairport + '</center></div>';
			memberEl.setAttribute('onclick','markerpopup.setHTML(\''+popupHTML+'\'); marker.setLngLat(['+ f.geometry.coordinates +']).addTo(map); map.flyTo({ zoom: 5.5, center: ['+ f.geometry.coordinates +'] });');
			rightbarList3El.append(memberEl);
		});
	
	}

} else if( navId == 'traffic') {
	
	document.title = 'G20 Traffic Advisory Map';
	var zoom = 11.5;
	if(map.getCanvasContainer().offsetWidth < 640) {
		zoom = 10.5
	}
	map.flyTo({zoom: zoom, center: [77.21, 28.625] });

	map.on('load',  async () => {
		
		let geoJSONData = await fetchJSON(MAP_BASE + mapId + '/data/zone.json');
		map.addSource('zones', { 'type': 'geojson', 'data': geoJSONData,
			"attribution" : 'Source <a href="https://traffic.delhipolice.gov.in/dtpg20info/traffic.html#:~:text=to%201300%20hrs.-,TRAFFIC%20REGULATIONS,-Vehicular%20movement%20on">Delhi Traffic Police</a>'
		});
		
		addFillLayer('zones', ['get', 'fill-color'], .5, .2);
		addLineLayer('zones', ['get', 'line-color'], 2);
		addSymbolLayer('zones', '', ['get', 'name']);
		
	});
	
}


