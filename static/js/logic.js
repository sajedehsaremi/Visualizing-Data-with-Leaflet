// Store our API endpoint as queryUrl.
let init = ()=> {
  // Perform a GET request to the query URL/
  d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });
};

let queryUrl = earthquakeJsonPath7days

let circleInfo = (magnitude, alt) => {
    return {
        radius: radiusSize(magnitude),
        fillColor: colorInfo(alt),
        fillOpacity: 1,
        stroke: false
    };
};

let radiusSize = (magnitude)=> {
    return Math.pow(magnitude,2)*500
};

let colorInfo = (alt) => {
    if (alt <= 5) {
        return '#FFCDD2';
    } else if (alt <= 12) {
        return '#E57373';
    } else if (alt <=18) {
        return '#F44336'
    } else if (alt <=24 ) {
        return '#D32F2F'
    } else if (alt <=30 ) {
        return '#FF5252'
    } else {
        return '#D50000'
    }
}

let createFeatures = (earthquakeData) => {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: (feature,layer) => {
       layer.bindPopup( `<h3>${feature.properties.place}</h3>
        <hr>
        <p>Magnitude: ${feature.properties.mag}
        | Depth: ${feature.geometry.coordinates[2]}
        </p>
        
        `)
        
    },
    pointToLayer: (feature, latlng) => {
       return new  L.circle(latlng, circleInfo(feature.properties.mag, latlng.alt))
    }
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

let createMap = (earthquakes) => {

  // Create the base layers.
  let map =  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
  let satilite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

  let outdoors = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
});

  // Create a baseMaps object.
  let baseMaps = {
    "Satellite": satilite,
    "Default": map,
    "Outdoors": outdoors
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes,
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      0,0
    ],
    zoom: 2,
    layers: [map, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  let legend = L.control ({position: 'bottomright'});
  legend.onAdd = (myMap) => {

    let div = L.DomUtil.create('div', 'info legend');
    let altitude = [5,12,18,24,30];
    let labels = ['Alt'];

    for (let i = 0; i < altitude.length; i++) {
      div.innerHTML +=
      '<i style="background:' + colorInfo(altitude[i] + 1) + '">'+labels+'</i> ' +
      altitude[i] + (altitude[i + 1] ? '&ndash;' + altitude[i + 1] + '<br>' : '+');
    };
      return div;
  };
  
  legend.addTo(myMap);
};

  

init()
