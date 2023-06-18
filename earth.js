import { key } from "./key.js";

window.addEventListener("load", Earth())

function Earth() {
    GetEarthImage()
}



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

        fetchImage(url)
        .then((imageBlob) => {
            var objectURL = URL.createObjectURL(imageBlob);
            document.getElementById("earth").src = objectURL;
            document.getElementById("earth-caption").innerText = `${capital.CapitalName}, ${capital.CountryName}`
            document.getElementById("longitude").innerText = capital.CapitalLongitude
            document.getElementById("latitude").innerText = capital.CapitalLatitude
            document.getElementById("date").innerText = date
        })
        .catch(() => {
            document.getElementById("earth").src = "kitten.png"
            document.getElementById("earth-caption").innerText = 'Looks like we weren\'t table to find the image, so heres a cat'
        });
    });
}

//Because the API sometimes gives 404 errors
function fetchImage(url, maxRetries = 3) {
    let retries = 0;
  
    return new Promise((resolve, reject) => {
      function loadImage() {
        fetch(url)
          .then((response) => {
            if (response.ok) {
              resolve(response.blob());
            } else if (response.status === 404 && retries < maxRetries) {
              retries++;
              loadImage();
            } else {
              reject(new Error(`Failed to fetch image: ${response.status}`));
            }
          })
          .catch((error) => {
            reject(new Error(`Failed to fetch image: ${error.message}`));
          });
      }
  
      loadImage();
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