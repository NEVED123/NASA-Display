import { key } from "./key.js";

window.addEventListener("load", Earth())

function Earth() {
    GetEarthImage()
    setInterval(()=>{
        GetEarthImage()
    },60000)
}

//TODO: HANDLE 404 ERROR
function GetEarthImage() {
    fetch('capitals.json')
    .then((response) => response.json())
    .then(async (capitals) => {
        const numCapitals = capitals.length
        const random_number = Math.floor(Math.random() * numCapitals);
        const capital = capitals[random_number]
        const date = generateRandomDate()
        
        const params = {
            lat: capital.CapitalLatitude,
            lon: capital.CapitalLongitude,
            date: date,
            api_key: key  
        }

        const queryString = new URLSearchParams(params).toString();

        document.getElementById("earth").src = `https://api.nasa.gov/planetary/earth/imagery?${queryString}`
        document.getElementById("earth-caption").innerText = `${capital.CapitalName}, ${capital.CountryName}`
        document.getElementById("longitude").innerText = capital.CapitalLongitude
        document.getElementById("latitude").innerText = capital.CapitalLatitude
        document.getElementById("date").innerText = date
    });
}


function generateRandomDate() {
    var startDate = new Date('2015-01-01');
    var endDate = new Date('2020-12-31');
  
    var randomTimestamp = Math.random() * (endDate.getTime() - startDate.getTime()) + startDate.getTime();
    var randomDate = new Date(randomTimestamp);
  
    var year = randomDate.getFullYear();
    var month = String(randomDate.getMonth() + 1).padStart(2, '0');
    var day = String(randomDate.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
}