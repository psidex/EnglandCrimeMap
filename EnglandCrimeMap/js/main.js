import * as map from "./map.js";
import * as crimes from "./crime.js";
import * as stats from "./stats.js";
import * as here from "./here.js";

const searchBox = document.getElementById("searchBox");

async function searchBoxSearch() {
    if (searchBox.value !== "") {
        const latLng = await here.findPlace(searchBox.value);

        map.clearMarkers();
        map.focusMap(latLng["Latitude"], latLng["Longitude"], 14);

        const [crimeCount, crimeCategoryFreq] = await processAndMarkCrimes(latLng["Latitude"], latLng["Longitude"], "2018", "01");
        stats.createCrimeFreqChart(crimeCount, crimeCategoryFreq);
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
        if (event.key === "Enter") {
            await searchBoxSearch();
        }
    });

    const latLng = await here.findPlace("portsmouth");
    map.setupMap();
    map.focusMap(latLng["Latitude"], latLng["Longitude"], 14);

    const [crimeCount, crimeCategoryFreq] = await processAndMarkCrimes(latLng["Latitude"], latLng["Longitude"], "2018", "01");
    stats.createCrimeFreqChart(crimeCount, crimeCategoryFreq);
});
