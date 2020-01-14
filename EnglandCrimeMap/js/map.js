export const map = L.map("mainMap").setView([54.13, -3.5], 6);

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

export function addCrimeMarker(category, lat, lng) {
    const m = L.marker([lat, lng]).addTo(map);
    m.bindPopup(category);
}
