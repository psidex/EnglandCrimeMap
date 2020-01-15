// Get all the crimes for the given parameters.
export async function getCrimes(lat, lng, year, month) {
    const url = `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lng}&date=${year}-${month}`;
    const response = await fetch(url);
    return await response.json();
}
