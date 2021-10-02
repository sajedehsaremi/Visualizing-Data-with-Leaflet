// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function bindpopuptomarker(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }
  function generatecolor(earthquakedepth) {
    if (earthquakedepth > 100) {
      return "#60397f"
    }
    if (earthquakedepth > 80) {
      return "#734498"
    }
    if (earthquakedepth > 60) {
      return "#864fb2"
    }
    if (earthquakedepth > 40) {
      return "#9a5acb"
    }
    if (earthquakedepth > 20) {
      return "#ad66e5"
    }

  }

  function generateearthquakestyle(feature, layer) {
    console.log(feature)
    return {
      color: generatecolor(feature.geometry.coordinates[2])
    }
  }

  function generatemarker (feature, latlong){
    return L.circleMarker(latlong)
  }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(data.features, {
    onEachFeature: bindpopuptomarker,
    style: generateearthquakestyle,
    pointToLayer: generatemarker
  });
  
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);

});

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      0, 0
    ],
    zoom: 2,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}