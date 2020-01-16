import * as map from "./map.js";
import * as crimes from "./crime.js";
import * as stats from "./stats.js";
import * as here from "./here.js";

const searchBox = document.getElementById("searchBox");
const crimeCountElement = document.getElementById("crimeCount");
const loadingBarDiv = document.getElementById("loadingBar");
let loadingBar = undefined;

// Change location of crimes being shown.
async function changeLocation(lat, lng, focus=false) {
    loadingBarDiv.style.visibility = "visible";
    loadingBarDiv.style.display = "block";

    map.clearMarkers();

    if (focus) {
        map.focusMap(lat, lng, 14);
    }

    const [crimeCount, crimeCategoryFreq] = await processAndMarkCrimes(lat, lng);

    crimeCountElement.innerText = `Crime Count: ${crimeCount}`;
    map.drawCrimeRadius(lat, lng);
    stats.createCrimeFreqChart(crimeCount, crimeCategoryFreq);

    loadingBarDiv.style.visibility = "hidden";
    loadingBarDiv.style.display = "none";

    if (crimeCount === 0) {
        // TODO: Less intrusive alert.
        alert("No crimes!");
    }

    // Reset loading bar.
    loadingBar.animate(0);
}

// Takes a place and date, adds markers for them, returns the total crime count and the frequency statistics.
async function processAndMarkCrimes(lat, lng) {
    const crimeDataArray = await crimes.getCrimes(lat, lng, (month) => {
        loadingBar.animate(month / 12);
    });

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

    // Setup progress bar.
    // https://progressbarjs.readthedocs.io/en/latest/api/shape/
    loadingBar = new ProgressBar.Circle("#loadingBar", {
        duration: 100,
        color: "#ff0000",
        fill: "rgba(50, 50, 50, 0.5)",
        text: {
            autoStyleContainer: false,
            style: {
                color: "black",
                position: "absolute",
                left: "50%",
                top: "50%",
                padding: 0,
                margin: 0,
                transform: {
                    prefix: true,
                    value: "translate(-50%, -50%)"
                }
            }
        },
        step: function(state, circle) {
            const value = Math.round(circle.value() * 100);
            circle.setText(value);
        }
    });

    map.setupMap();

    // Salisbury as the default starting location.
    await changeLocation(51.067182846365604, -1.797895431518555, true);
});
