// Creating the map object
var myMap = L.map("map", {
    center: [40, 0],
    zoom: 2.3
  });
  
  // Adding the tile layer
  var tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Use this link to get the GeoJSON data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Return varied shade depending on earthquake depth
function chooseColor(depth){
 // console.log("depth: ");
 // console.log(depth);
  switch(true){
    case depth > 80:
      return "#993300";
    case depth > 60:
      return "#ff3300";
    case depth > 40:
      return "#ff6600";
    case depth > 20:
      return "#ff6666";
    case depth > 10:
      return "#ff9999";
    default:
      return "#ffcccc";

  }
}

// Larger magnitude returns larger marker radius
function chooseRadius(m){
  // console.log("Mag");
  // console.log(m);
  if (m == 0){
    var mag = 1;
    return mag;
  }
  var mag = m * 3.75;
  return mag;
}


// Getting our GeoJSON data
d3.json(link).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {

    // Add circle marker
    // https://stackoverflow.com/questions/25364072/how-to-use-circle-markers-with-leaflet-tilelayer-geojson
    pointToLayer: function(features, coords){
      return L.circleMarker(coords);
    },

    // Style the marker based on magnitude and depth of earthquake
    style: function(f){
    
      return {
      opacity: 0.6,
      fillOpacity: 1,
      fillColor: chooseColor(f.geometry.coordinates[2]),
      color: "#000000",
      radius: chooseRadius(f.properties.mag),
      stroke: true,
      weight: 0.5
      };
    },

    // Offer additional quake info when marker is clicked
    onEachFeature: function(features, l){
      l.bindPopup("Located at: " + features.properties.place + "<br>Magnitude: " + features.properties.mag + "<br>Alert: " + features.properties.alert);
    }
  }).addTo(myMap);
  


  // Legend
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    let depthrange = [0, 10, 20, 40, 60, 80];
    let colors = ["#ffcccc", "#ff9999", "#ff6666", "#ff6600","#ff3300", "#993300"];
    var div = L.DomUtil.create("div", "legend");

    // Insert depth range colors into legend HTML
    for (var i = 0; i<depthrange.length -1 ; i++) {
      div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      depthrange[i] + "&ndash;"+ depthrange[i + 1]  + "<br>" ;
    }
    div.innerHTML += "<i style='background: " + colors[depthrange.length-1] + "'></i> " +
    depthrange[depthrange.length-1] + "+";
    return div;
   
  };

  legend.addTo(myMap)

});
