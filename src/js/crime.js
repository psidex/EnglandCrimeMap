// Get all the crimes for the given parameters. progressFunction is called every time 1 of the 12 months is loaded.
export async function getCrimes(lat, lng, progressFunction) {
    let crimes = [];

    for (let month=1; month<=12; month++) {
        const url = `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lng}&date=2019-${month}`;
        const response = await fetch(url);
        const data = await response.json();
        crimes = crimes.concat(data);

        progressFunction(month);
    }

    return crimes;
}
