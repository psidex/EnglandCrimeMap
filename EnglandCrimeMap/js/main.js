import * as map from "./map.js";
import * as crimes from "./crime.js";
import * as stats from "./stats.js";

const CrimeMarkerAccuracy = 5;  // Within 1.11m - http://wiki.gis.com/wiki/index.php/Decimal_degrees.

let currentMarkers = [];

window.addEventListener("load", async () => {
    map.setupMap();

    const crimeArray = await crimes.getCrimes("52.629729", "-1.131592", "2017", "01");

    for (const crime of crimeArray) {

        const lat = parseFloat(crime.location.latitude).toFixed(CrimeMarkerAccuracy);
        const lng = parseFloat(crime.location.longitude).toFixed(CrimeMarkerAccuracy);

        const latString = lat.toString();
        const lngString = lng.toString();

        const location = latString + lngString;

        if (!currentMarkers.includes(location)) {
            map.addCrimeMarker(crime.category, lat, lng);
            currentMarkers.push(location);
        }

    }

    stats.createChart();
});
