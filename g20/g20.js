
var navId = params.get('nav');

document.title = 'G20 World Map';
document.getElementsByTagName('link')[0].href = MAP_BASE + mapId + '/img/g20-xxxs.png';

map.setZoom(3.5);
map.setPitch(45);

rightheaderEl.style.display = 'flex';
rightheaderEl.firstElementChild.src = MAP_BASE + mapId + '/img/g20-lg.png';
rightheaderEl.setAttribute('onclick', 'setNav("")');

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
	//var titleHeight = ( ( 18 * noOfList ) + ( 10 * ( noOfList + 1 ) ) );
	var titleHeight = (35 * noOfList) + 40;

	let rightbarListTitleEl = document.createElement('div');
	rightbarListTitleEl.append('Members');
	rightbarEl.append(rightbarListTitleEl);

	let rightbarListEl = document.createElement('ol');
	rightbarListEl.classList.add('rightbarlist');
	rightbarEl.append(rightbarListEl);

	var hr2El = document.createElement('hr');
	rightbarEl.append(hr2El);

	let rightbarList2TitleEl = document.createElement('div');
	rightbarList2TitleEl.append('Invitees');
	rightbarEl.append(rightbarList2TitleEl);

	var rightbarList2El = document.createElement('ol');
	rightbarList2El.classList.add('rightbarlist');
	rightbarEl.append(rightbarList2El);

	var hr3El = document.createElement('hr');
	rightbarEl.append(hr3El);

	let rightbarList3TitleEl = document.createElement('div');
	rightbarList3TitleEl.append('Host Cities');
	rightbarEl.append(rightbarList3TitleEl);

	var rightbarList3El = document.createElement('ol');
	rightbarList3El.classList.add('rightbarlist');
	rightbarEl.append(rightbarList3El);
	
	var hr4El = document.createElement('hr');
	rightbarEl.append(hr4El);
	
	let rightbarList4TitleEl = document.createElement('div');
	rightbarList4TitleEl.append('Traffic Control');
	rightbarEl.append(rightbarList4TitleEl);
	rightbarList4TitleEl.setAttribute('onclick','setNav("traffic")');
	rightbarList4TitleEl.classList.add('nolist');

	rightbarListHeight = (rightbarEl.clientHeight -  titleHeight ) / noOfList;

	makeCollapsible(rightbarListTitleEl);
	makeCollapsible(rightbarList2TitleEl);
	makeCollapsible(rightbarList3TitleEl);

	collapse(rightbarListTitleEl);
	collapse(rightbarList2TitleEl);
	collapse(rightbarList3TitleEl);

	map.on('load',  async () => {

		map.loadImage(  MAP_BASE + mapId + '/img/g20-xxxs.png',
		
			(error, image) => {
			
				if (error) throw error;
				
				map.addImage('host', image);

				map.addSource('host', {
					'type': 'geojson',
					'data': {
						'type': 'FeatureCollection',
						'features': [
							{
								'type': 'Feature',
								'properties': {
									"member": "India",
									"summit": "Hosting in 2023",
									"leader": "Narendra Modi",
									"designation": "Prime Minister"
								},
								'geometry': {
									'type': 'Point',
									'coordinates': [78, 22]
								}
							}
						]
					},
					"attribution" : 'Source <a href="https://g20.org">G20</a>'
				});
				
				map.addLayer({
					'id': 'host',
					'type': 'symbol',
					'source': 'host',
					'layout': {
						'icon-image': 'host',
						'text-field': ['format', ['get', 'member'], ' \n ', ['get', 'summit'] ],
						'text-font': [ 'NotoSans-Regular'],
						'text-offset': [2, .5],
						'text-anchor': 'left'
					}
				});
				
				var memberEl = document.createElement('li');
				memberEl.innerHTML = '<img class="logo" src="' + MAP_BASE + mapId + '/img/flag/India.png"></img>India ( Host )';
				memberEl.setAttribute('onclick','map.flyTo({ zoom: 3.5, center: [80,22] });');
				rightbarListEl.prepend(memberEl);
			}
		);
			
		map.loadImage( 'img/pin-sm.png',
			async (error, image) => {
				
				if (error) throw error;
				
				map.addImage('pin', image);
				
				let response = await fetch( MAP_BASE + mapId + '/data/member.json');
				let sourceContent = await response.text();
		
				let geoJSONContent = JSON.parse(sourceContent);
				map.addSource('member', { 'type': 'geojson','data': geoJSONContent });

				map.addLayer({
					'id': 'member',
					'type': 'symbol',
					'source': 'member',
					'layout': {
						'icon-image': 'pin',
						'text-field': ['format', ['get', 'member'], ' \n ', ['get', 'summit'] ],
						'text-font': [ 'NotoSans-Regular'],
						'text-offset': [1, .5],
						'text-anchor': 'left'
					}
				});
				
				geoJSONContent.features.forEach( (f) => {
					var memberEl = document.createElement('li');
					memberEl.innerHTML = '<img class="logo" src="'+ MAP_BASE + mapId + '/img/flag/'+f.properties.member+'.png"</img>' + f.properties.member;
					memberEl.setAttribute('onclick','map.flyTo({ zoom: 4.5, center: ['+ f.geometry.coordinates +'] })');
					rightbarListEl.append(memberEl);
				});
			
			}	

		);
		
		map.loadImage( 'img/pin-blue-sm.png',
			async (error, image) => {
			
				if (error) throw error;
				
				map.addImage('pin-blue', image);
		
				var response = await fetch( MAP_BASE + mapId + '/data/invitee.json');
				var sourceContent = await response.text();

				var geoJSONContent = JSON.parse(sourceContent);
				map.addSource('invitee', { 'type': 'geojson','data': geoJSONContent });

				map.addLayer({
					'id': 'invitee',
					'type': 'symbol',
					'source': 'invitee',
					'layout': {
						'icon-image': 'pin-blue',
						'text-field': ['get', 'invitee'],
						'text-font': [ 'NotoSans-Regular'],
						'text-offset': [1, .5],
						'text-anchor': 'left'
					}
				});
							
				geoJSONContent.features.forEach( (f) => {
					var memberEl = document.createElement('li');
					memberEl.innerHTML = '<img class="logo" src="' + MAP_BASE + mapId + '/img/flag/'+f.properties.invitee+'.png"</img>' + f.properties.invitee;
					memberEl.setAttribute('onclick','map.flyTo({ zoom: 4.5, center: ['+ f.geometry.coordinates +'] })');
					rightbarList2El.appendChild(memberEl);
				});
			
			}
			
		);
		
		let response = await fetch( MAP_BASE + mapId + '/data/host.json');
		let sourceContent = await response.text();

		let geoJSONContent = JSON.parse(sourceContent);
		
		geoJSONContent.features.forEach( (f) => {
			var memberEl = document.createElement('li');
			memberEl.innerHTML = f.properties.city;
			var popupHTML = '<div style="width: 175px"><center> <b>Nearest Airport</b><hr> <img style="width:20px" src="img/flight_takeoff.jpg"> </img>' + f.properties.nearestairport + '</center></div>';
			memberEl.setAttribute('onclick','markerpopup.setHTML(\''+popupHTML+'\'); marker.setLngLat(['+ f.geometry.coordinates +']).addTo(map); map.flyTo({ zoom: 5.5, center: ['+ f.geometry.coordinates +'] });');
			rightbarList3El.append(memberEl);
		});
		
		['host','member','invitee'].forEach((c)=> {
		
			map.on('mouseenter', c, (e) => {

				map.getCanvas().style.cursor = 'pointer';
				
				var feature = e.features[0];
				const coordinates = feature.geometry.coordinates.slice();
				
				if(feature.properties.leader) {
				
					const description = '<div style="width: 100px"><center> <b>' + feature.properties.designation + '</b>' + ' <hr> <br> <img style="height:50px" src="'+ MAP_BASE + mapId + '/img/leader/' + (feature.properties.member || feature.properties.invitee) + '.png"> </img> <br>' + feature.properties.leader + '</center></div>' ;

					// Ensure that if the map is zoomed out such that multiple
					// copies of the feature are visible, the popup appears
					// over the copy being pointed to.
					while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
						coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
					}

					popup.setLngLat(coordinates).setHTML(description).addTo(map);
				}

			});

			map.on('mouseleave', c, () => {
				map.getCanvas().style.cursor = '';
				popup.remove();
			});
			
		});

	});

} else if( navId == 'traffic') {
	
	document.title = 'G20 Traffic Advisory Map';
	var zoom = 11.5;
	if(map.getCanvasContainer().offsetWidth < 640) {
		zoom = 10.5
	}
	map.flyTo({zoom: zoom, center: [77.21, 28.625] });

	var DEF_FILL_OPACITY = 0.5;
	var HOVER_FILL_OPACITY = 0.2;

	map.addSource('zone3', { 'type': 'geojson', 'data': MAP_BASE + mapId + '/data/zone3.json' });

	map.addLayer({
		'id': 'zone3',
		'type': 'fill',
		'source': 'zone3',
		'paint': {
			'fill-color': ['get', 'fill-color'],
			'fill-opacity': DEF_FILL_OPACITY
		}
	});

	map.addLayer({
		'id': 'zone3-borders',
		'type': 'line',
		'source': 'zone3',
		'layout': {},
		'paint': {
			'line-color': 'blue',
			'line-width': 2
		}
	});


	map.addSource('zone1', { 'type': 'geojson', 'data': MAP_BASE + mapId + '/data/zone1.json' });

	map.addLayer({
		'id': 'zone1',
		'type': 'fill',
		'source': 'zone1',
		'paint': {
			'fill-color': ['get', 'fill-color'],
			'fill-opacity': DEF_FILL_OPACITY
		}
	});

	map.addLayer({
		'id': 'zone1-borders',
		'type': 'line',
		'source': 'zone1',
		'layout': {},
		'paint': {
			'line-color': 'orange',
			'line-width': 2
		}
	});


	map.addSource('zone2', { 'type': 'geojson', 'data': MAP_BASE + mapId + '/data/zone2.json' });

	map.addLayer({
		'id': 'zone2',
		'type': 'fill',
		'source': 'zone2',
		'paint': {
			'fill-color': ['get', 'fill-color'],
			'fill-opacity': DEF_FILL_OPACITY
		}
	});

	map.addLayer({
		'id': 'zone2-borders',
		'type': 'line',
		'source': 'zone2',
		'layout': {},
		'paint': {
			'line-color': 'red',
			'line-width': 2
		}
	});

	['zone1','zone2','zone3'].forEach((z)=> {

		map.on('mouseenter', z, (e) => {
			if (e.features.length > 0) {
				map.setPaintProperty(z, 'fill-opacity', HOVER_FILL_OPACITY);
			}
		});

		map.on('mouseleave', z, () => {
			map.setPaintProperty(z, 'fill-opacity', DEF_FILL_OPACITY);
		});

	});


	map.addSource('zones', { 'type': 'geojson', 'data': MAP_BASE + mapId + '/data/zones.json' });

	map.addLayer({
		'id': 'zones',
		'type': 'symbol',
		'source': 'zones',
		'layout': {
			'text-field': ['get', 'zone'],
			'text-font': [ 'NotoSans-Regular'],
			'text-anchor': 'left'
		}
	});

}