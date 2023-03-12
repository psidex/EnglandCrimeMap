import * as map from "./map.js";
import * as crimes from "./crime.js";
import * as charts from "./charts.js";
import * as here from "./here.js";

let loading = false;  // For disabling the search box when loading.
const searchBox = document.getElementById("searchBox");
const crimeCountElement = document.getElementById("crimeCount");
const loadingBarDiv = document.getElementById("loadingBar");
let loadingBar = undefined;

// Change location of crimes being shown.
async function changeLocation(lat, lng, focus=false) {
    // Reset loading bar to 0.
    loadingBar.animate(0, false);

    map.disableClickEvent();
    loading = true;

    // Show Loading bar.
    loadingBarDiv.style.visibility = "visible";
    loadingBarDiv.style.display = "block";

    map.clearMarkers();

    if (focus) {
        map.focusMap(lat, lng, 14);
    }

    // Get data for all crimes in last year at the given location.
    const [crimeDataArray, crimesPerMonth] = await crimes.getCrimes(lat, lng, (month) => {
        loadingBar.animate(month / 12);
    });

    // Place markers for crimes and calculate crime frequency.
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

    // Update text.
    const crimeCount = crimeDataArray.length;
    crimeCountElement.innerText = `Crime Count: ${crimeCount}`;

    // Update map and stats.
    map.drawCrimeRadius(lat, lng);
    charts.createCrimeFreqPie(crimeCount, crimeCategoryFreq);
    charts.createCrimeOverTimeChart(crimesPerMonth);

    // Hide and reset loading bar.
    loadingBarDiv.style.visibility = "hidden";
    loadingBarDiv.style.display = "none";

    map.enableClickEvent();
    loading = false;

    if (crimeCount === 0) {
        // TODO: Less intrusive alert.
        alert("No crimes!");
    }
}

window.addEventListener("load", async () => {
    document.getElementById("title").innerText = `Data for crimes in ${(new Date()).getFullYear() - 1}`;

    // Setup events.

    searchBox.addEventListener("keyup", async function(event) {
        if (event.key === "Enter" && searchBox.value !== "" && loading === false) {
            const latLng = await here.findPlace(searchBox.value);
            await changeLocation(latLng["Latitude"], latLng["Longitude"], true);
            // Reset search box.
            searchBox.value = "";
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
        fill: "rgba(257, 255, 250, 0.5)",
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
            circle.setText(Math.round(circle.value() * 100));
        }
    });

    map.setupMap();

    // Salisbury as the default starting location.
    await changeLocation(51.067182846365604, -1.797895431518555, true);
});
