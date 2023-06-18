import { key } from "./key.js";

window.addEventListener("load", Earth())

function Earth() {
    GetEarthImage()

    setInterval(()=>{
        GetEarthImage()
    }, 10000)
}

let attempts = 0

function GetEarthImage() {
    fetch('capitals.json')
    .then((response) => response.json())
    .then((capitals) => {
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

        const url = `https://api.nasa.gov/planetary/earth/imagery?${queryString}`

        //Because the API sometimes gives 404 errors
        fetch(url)
        .then((response) => {
          if (response.ok) {
            response.blob()
            .then((blob) => {
                var objectURL = URL.createObjectURL(blob);
                document.getElementById("earth").src = objectURL;
                document.getElementById("earth-caption").innerText = `${capital.CapitalName}, ${capital.CountryName}`
                document.getElementById("longitude").innerText = capital.CapitalLongitude
                document.getElementById("latitude").innerText = capital.CapitalLatitude
                document.getElementById("date").innerText = date
            })
            .catch(() => {
                displayKittykat()
            });
          } 
          else if (response.status === 404 && attempts < maxRetries) {
            attempts++;
            loadImage();
          } 
          else {
            console.warn(`Failed to fetch image: ${response.status}`);
            displayKittykat()
          }
        })
        .catch((error) => {
          console.warn(`Failed to fetch image: ${error.message}`);
          displayKittykat()
        });
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

function displayKittykat() {
    document.getElementById("earth").src = "kitten.png"
    document.getElementById("earth-caption").innerText = 'Looks like we weren\'t table to find the image, so heres a cat'
}