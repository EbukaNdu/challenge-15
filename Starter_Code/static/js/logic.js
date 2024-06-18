// Create a Leaflet map centered on a specific location and set the zoom level
const map = L.map('map').setView([20, 0], 2);

// Add OpenStreetMap tiles as the base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Function to determine the color based on earthquake depth
function getColor(depth) {
    return depth > 90 ? '#EA2C2C' :
           depth > 70 ? '#EA822C' :
           depth > 50 ? '#EE9C00' :
           depth > 30 ? '#EECC00' :
           depth > 10 ? '#D4EE00' : '#98EE00';
}

// Function to determine the size of the marker based on earthquake magnitude
function getRadius(magnitude) {
    return magnitude * 4; // Adjust size for better visualization
}

// Function to style the markers
function styleFeature(feature) {
    return {
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]), // Depth is the third coordinate
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
}

// Function to handle each feature in the GeoJSON data
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.place) {
        layer.bindPopup(`<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${feature.properties.mag}<br><b>Depth:</b> ${feature.geometry.coordinates[2]} km`);
    }
}

// URL for the earthquake GeoJSON data
const earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch and visualize the earthquake data
d3.json(earthquakeDataUrl).then(data => {
    // Add a GeoJSON layer to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, styleFeature(feature));
        },
        onEachFeature: onEachFeature
    }).addTo(map);
});

// Create a legend to display the depth color coding
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<strong>Depth (km)</strong><br>';
    div.innerHTML += '<i style="background: #98EE00"></i> &lt; 10<br>';
    div.innerHTML += '<i style="background: #D4EE00"></i> 10-30<br>';
    div.innerHTML += '<i style="background: #EECC00"></i> 30-50<br>';
    div.innerHTML += '<i style="background: #EE9C00"></i> 50-70<br>';
    div.innerHTML += '<i style="background: #EA822C"></i> 70-90<br>';
    div.innerHTML += '<i style="background: #EA2C2C"></i> &gt; 90<br>';
    return div;
};

legend.addTo(map);
