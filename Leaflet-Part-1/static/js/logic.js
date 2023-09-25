//Data set for the last 7 days from 9-23 of the earthquake

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//print out the data to study it. 
d3.json(url).then(function (data) {
    console.log("Data is ",data)
    console.log("Features",data.features)
 
 mapp();
});

function mapp(){

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  var WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});

  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo,
    "World Street Map": WorldStreetMap};

  let earthquakes = new L.LayerGroup();

  let overlayMaps = {
    Earthquakes: earthquakes
  };


    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]
      });

      L.control.layers(baseMaps, overlayMaps,  
        {collapsed:false
          }).addTo(myMap);


  //this styleInfo function will dictate the stying for all of the earthquake points on the map
function styleInfo(feature) {
  return {
      color: chooseColor(feature.geometry.coordinates[2]),
      radius: chooseRadius(feature.properties.mag), //sets radius based on magnitude 
      fillColor: 1 //sets fillColor based on the depth of the earthquake
  }
};

//define a function to choose the fillColor of the earthquake based on earthquake depth
function chooseColor(depth) {
  if (depth <= 10) return "red";
  else if (depth > 10 & depth <= 25) return "orange";
  else if (depth > 25 & depth <= 40) return "yellow";
  else if (depth > 40 & depth <= 55) return "pink";
  else if (depth > 55 & depth <= 70) return "blue";
  else return "green";
};

//define a function to determine the radius of each earthquake marker
function chooseRadius(magnitude) {
  return magnitude*5;
};


  d3.json(url).then(function(data) {

    L.geoJson(data, {
            pointToLayer: function (feature, latlon) {  
                return L.circleMarker(latlon).bindPopup(`<h3>Place</h3><hr><p>${(feature.properties.place)}</p>`); 
            },
            style:styleInfo
           
            
        }).addTo(earthquakes); 
        earthquakes.addTo(myMap);


    });
 
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
       div.innerHTML += "<h4>Depth Color Legend</h4>";
       div.innerHTML += '<i style=background: red></i><span>(Red for Depth < 10)</span><br>';
       div.innerHTML += '<i style="background: orange"></i><span>(Orange for 10 < Depth <= 25)</span><br>';
       div.innerHTML += '<i style="background: yellow"></i><span>(Yellow for 25 < Depth <= 40)</span><br>';
       div.innerHTML += '<i style="background: pink"></i><span>( Pink for 40 < Depth <= 55)</span><br>';
       div.innerHTML += '<i style="background: blue"></i><span>Blue for 55 < Depth <= 70)</span><br>';
       div.innerHTML += '<i style="background: green"></i><span>(Green for Depth > 70)</span><br>';
  
    return div;
  };
  //add the legend to the map
  legend.addTo(myMap);

};    




