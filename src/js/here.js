// For the here.com API.

const apiKey = "tiAdQglYOq_N8UXiBZ0leefYyXJEDCxfxPNDz93qPCs";

// Returns an object with the keys "Latitude" and "Longitude".
export async function findPlace(search) {
    const url = `https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=${apiKey}&searchtext=${search}&countryfocus=GBR&maxresults=1`;
    const response = await fetch(url);
    const data = await response.json();
    return data["Response"]["View"][0]["Result"][0]["Location"]["NavigationPosition"][0];
}
