const fs = require('fs');

// Read the contents of the file
const readFile = async (path) => {
  const data = await fs.promises.readFile(path, 'utf8');
  return data;
};

// Write the contents of the file
const writeFile = async (path, data) => {
  await fs.promises.writeFile(path, data);
};

(async function() {

// Read the contents of the file
const data = await readFile('./earthquakes2d.geojson');

var jsondata = JSON.parse(data);
jsondata.features.forEach(function(f) {

	var coords = f.geometry.coordinates;
	f.properties.height = coords[2];

	var newCoords = [ ];

	var step = [coords[0], coords[1]];
	step[0] = step[0] + .1;
	//step[1] = step[1] + .0001;	
	newCoords.push(step);
	
	step = [coords[0], coords[1]];
	//step[0] = step[0] + .0001;
	step[1] = step[1] + .1;	
	newCoords.push(step);
	
	step = [coords[0], coords[1]];
	step[0] = step[0] - .1;
	//step[1] = step[1] - .0001;
	newCoords.push(step);

	step = [coords[0], coords[1]];
	//step[0] = step[0] - .0001;
	step[1] = step[1] - .1;	
	newCoords.push(step);

	newCoords.push(newCoords[0]);

	f.geometry.coordinates = [newCoords];
	f.geometry.type = 'Polygon';
});


var stringdata = JSON.stringify(jsondata);

// Write the contents of the file
await writeFile('./earthquakes3d.geojson', stringdata);
})();