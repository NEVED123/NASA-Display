import { key } from "./key.js";

window.addEventListener("load", Earth())

function Earth()
{
    GetEarthImage()

    setInterval(()=>{
        GetEarthImage
    },120000)
}

function GetEarthImage() {
    fetch('capitals.json')
    .then((response) => response.json())
    .then((capitals) => {
        const numCapitals = capitals.length

        for(let i = 1;i<=3;i++)
        {
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
            
            GetEarthImageUrl(url)
            .then((url)=>{
                document.getElementById(`earth-${i}`).src = url;
                document.getElementById(`earth-caption-${i}`).innerText = `${capital.CapitalName}, ${capital.CountryName}`
                document.getElementById(`longitude-${i}`).innerText = capital.CapitalLongitude
                document.getElementById(`latitude-${i}`).innerText = capital.CapitalLatitude
                document.getElementById(`date-${i}`).innerText = date
            })
            .catch((kitten)=>{
                document.getElementById(`earth-${i}`).src = kitten
                document.getElementById(`earth-caption-${i}`).innerText = `Looks like we couldn't find the picture, so here's a cat`
                document.getElementById(`longitude-${i}`).innerText = ""
                document.getElementById(`latitude-${i}`).innerText = ""
                document.getElementById(`date-${i}`).innerText = ""
            })
        }
    });
}

//Because the API sometimes gives 404 errors
function GetEarthImageUrl(url)
{
    let attempts = 0
    return new Promise((resolve, reject)=>{

        function GetImage(){
            fetch(url)
            .then((response) => {
              if (response.ok) {
                response.blob()
                .then((blob) => {
                    const imgUrl = URL.createObjectURL(blob);
                    resolve(imgUrl)
                })
                .catch(() => {
                    reject("kitten.png")
                });
              } 
              else if (attempts < 3) {
                attempts++;
                GetImage()
              } 
              else {
                console.warn(`Failed to fetch image: ${response.status}`);
                reject("kitten.png")
              }
            })
            .catch((error) => {
              console.warn(`Failed to fetch image: ${error.message}`);
              reject("kitten.png")
            });
        }

        GetImage()
    })

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