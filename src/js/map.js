// Store the current markers and where they are.
let currentMarkers = [];
let currentMarkerLocations = [];
let crimeRadiusCircle = null;

let map = L.map("mainMap");

// Clear memory of all markers.
export function clearMarkers() {
    if (crimeRadiusCircle !== null) {
        map.removeLayer(crimeRadiusCircle);
    }
    currentMarkers.forEach(marker => {map.removeLayer(marker);});
    currentMarkerLocations = [];
    currentMarkers = [];
}

export function focusMap(lat, lng, zoom) {
    map.setView([lat, lng], zoom);
}

export function setupMap() {
    L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            id: "mapbox/streets-v11",
            accessToken: "pk.eyJ1IjoidGhhdGd1eXdpdGh0aGF0bmFtZSIsImEiOiJjazVkOTlqeHExeWxtM21wYW02eWN1aWE2In0.aCbFj3kayrTKS9dQ7vhXSA"
        }
    ).addTo(map);
}

// Draws a circle showing the area covered by the crime API.
export function drawCrimeRadius(lat, lng) {
    crimeRadiusCircle = L.circle([lat, lng], {
        color: "red",
        fillOpacity: 0,
        radius: 1609.34  // 1 mile in km.
    }).addTo(map);
}

// Takes a crime category, a lat, and a lng. Add a marker to the map with a popup that shows the category.
// Only adds the marker if there isn't already one there.
export function addCrimeMarker(category, lat, lng) {
    // Rounds to 5 decimal places, see https://stackoverflow.com/a/29494612/6396652.
    lat = Math.round(lat * 1e5) / 1e5;
    lng = Math.round(lng * 1e5) / 1e5;

    const latString = lat.toString();
    const lngString = lng.toString();

    // This allows easy storage of the exact location in an array with the ability to check for it (using includes).
    const location = latString + lngString;

    if (!currentMarkerLocations.includes(location)) {
        const m = L.marker([lat, lng]).addTo(map);
        m.bindPopup(category);

        currentMarkerLocations.push(location);
        currentMarkers.push(m);
    }
}

export function setMapOnClick(func) {
    map.on("click", func);
}
