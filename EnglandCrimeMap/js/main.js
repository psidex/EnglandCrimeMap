import * as map from "./map.js";
import * as crimes from "./crime.js";
import * as stats from "./stats.js";
import * as here from "./here.js";

const searchBox = document.getElementById("searchBox");
const crimeCountElement = document.getElementById("crimeCount");

// Change location of crimes being shown.
// TODO: Show user that data is being loaded and processed.
async function changeLocation(lat, lng, focus=false) {
    map.clearMarkers();

    if (focus) {
        map.focusMap(lat, lng, 14);
    }

    const [crimeCount, crimeCategoryFreq] = await processAndMarkCrimes(lat, lng, "2018", "01");

    crimeCountElement.innerText = `Crime Count: ${crimeCount}`;
    map.drawCrimeRadius(lat, lng);
    stats.createCrimeFreqChart(crimeCount, crimeCategoryFreq);

    if (crimeCount === 0) {
        // TODO: Less intrusive alert.
        alert("No crimes!");
    }
}

// Takes a place and date, adds markers for them, returns the total crime count and the frequency statistics.
async function processAndMarkCrimes(lat, lng, year, month) {
    const crimeDataArray = await crimes.getCrimes(lat, lng, year, month);
    const crimeCategoryFreq = {};

    for (const crimeObj of crimeDataArray) {

        // Process frequency of crime.
        if (crimeCategoryFreq[crimeObj.category] === undefined) {
            crimeCategoryFreq[crimeObj.category] = 1;
        } else {
            crimeCategoryFreq[crimeObj.category] += 1;
        }

        // Process marker on map.
        const lat = parseFloat(crimeObj.location.latitude);
        const lng = parseFloat(crimeObj.location.longitude);
        map.addCrimeMarker(crimeObj.category, lat, lng);

    }

    return [crimeDataArray.length, crimeCategoryFreq];
}

window.addEventListener("load", async () => {
    // Setup events.
    searchBox.addEventListener("keyup", async function(event) {
        if (event.key === "Enter" && searchBox.value !== "") {
            const latLng = await here.findPlace(searchBox.value);
            await changeLocation(latLng["Latitude"], latLng["Longitude"], true);
        }
    });

    map.setMapOnClick(async (e) => {
        await changeLocation(e["latlng"]["lat"], e["latlng"]["lng"]);
    });

    const latLng = await here.findPlace("portsmouth");

    map.setupMap();
    await changeLocation(latLng["Latitude"], latLng["Longitude"], true);
});
