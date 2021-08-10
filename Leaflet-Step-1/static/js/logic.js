//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson
//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson

//point to the API and queryURL
var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//Get the data from the JSON with D3
d3.json(quakeURL, function(data) {
    console.log (data)
    createFeatures(data.features);
});

//create the functions to run on the features
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData), {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3> Location: " + feature.properties.place + "</h3><hr><p> Date/Time: " + new Date(feature.properties.time) + "</p><p> Magnitude: " + feature.properties.mag + "</p>"); 
        },

        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: getRadius(feature.properties.mag),
              fillColor: circleColor(earthquakeData.geometry.coordinates[2]),
              fillOpacity: .6,
              color: "black",
              stroke: true,
              weight: .75
            })
        }
    });
    createMap (earthquakes);
}

//create the mapping and layers
function createMap(earthquakes) {
    var topoMap = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 20,
        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
    });

    var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var let satelliteMap = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    var baseMaps = {
        "Topo Map": topoMap,
        "Street Map": streetMap,
        "Satellite Map": satelliteMap
    }
});

// Create an overlay object to hold the overlay layer
var overlayMaps = {
    "Earthquakes": earthquakes
};
    
// Create a myMap centered on Houston
var myMap = L.map("map", {
    center: [29.75, -95.37],
    zoom: 3,
    layers: [topoMap, earthquakes]
});
//Add layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
    legend: true
}).addTo(myMap);

// Create a legend
var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = [],
    grades = [0,1,2,3,4,5];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
    };
    legend.addTo(myMap);
}

// Create the color function based on the Richter magnitudes
function getColor(magnitude) {
    if (magnitude > 7) {
        return 'red'
    } else if (magnitude > 6) {
        return 'orange'
    } else if (magnitude > 5) {
        return 'yellow'
    } else if (magnitude > 4) {
        return 'lightgreen'
    } else if (magnitude > 2) {
        return 'green'
    } else {
        return 'blue'
    }
};

//Create radius function
function getRadius(magnitude) {
    return magnitude * 25000;
};

