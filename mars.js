import { key } from "./key.js";

let storedImageArray

window.addEventListener("DOMContentLoaded", Mars())

function Mars() {
    GetMarsImages()
    DisplayMarsImages();

    setInterval(()=>{
        DisplayMarsImages()
    }, 90000)
}

function GetMarsImages() {

    let imageArray = []

    for(let i = 0;i<3;i++) {
        imageArray.push(GetImageObject())
    }

    storedImageArray = imageArray
}

function DisplayMarsImages() {

    for(let i = 1;i<=3;i++)
    {
        storedImageArray[i-1]
        .then((photo)=>{
            const src = photo.img_src
            const fullCamName = photo.camera.full_name
            const roverName = photo.rover.name
            const sol = photo.sol

            document.getElementById(`mars-${i}`).src = src
            document.getElementById(`rover-name-${i}`).innerText = roverName
            document.getElementById(`sol-${i}`).innerText = `Sol: ${sol}`
            document.getElementById(`camera-${i}`).innerText = `Camera: ${fullCamName}`
        })
        .catch((kitten)=>{
            document.getElementById(`mars-${i}`).src = kitten
            document.getElementById(`rover-name-${i}`).innerText = `Looks like we couldn't find the picture, so here's a cat`
            document.getElementById(`sol-${i}`).innerText = ""
            document.getElementById(`camera-${i}`).innerText = ""
        })
                
    }

    GetMarsImages();
}

//makes a request to the api with a randomly generated URL. Looks fugly because it has to account for
//networking errors, the possibility that the url does not have any images associated with it.
//Returned data is an array of these objects:
/*
    {
        "id": 62095,
        "sol": 410,
        "camera": {
            "id": 25,
            "name": "MARDI",
            "rover_id": 5,
            "full_name": "Mars Descent Imager"
        },
        "img_src": "http://mars.jpl.nasa.gov/msl-raw-images/msss/00410/mrdi/0410MD0100000000E1_DXXX.jpg",
        "earth_date": "2013-10-01",
        "rover": {
            "id": 5,
            "name": "Curiosity",
            "landing_date": "2012-08-06",
            "launch_date": "2011-11-26",
            "status": "active"
        }
    }
*/

//I want to preload that img from the URL into a BLOB, so I can display it quickly when necessary. However, this causes the following issue:
/*
    Access to fetch at 'https://mars.jpl.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/00406/opgs/edr/rcam/RLB_433528397EDR_F0161584RHAZ00323M_.JPG' 
    (redirected from 'http://mars.jpl.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/00406/opgs/edr/rcam/RLB_433528397EDR_F0161584RHAZ00323M_.JPG') 
    from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an 
    opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
 */

function GetImageObject()
{
    let attempts = 0;
    let url = generateUrl()

    return new Promise((resolve, reject)=>{
        function GetObject(){
        
            fetch(url)
            .then((response) => {
                if(response.ok) {
                    response.json()
                    .then((mars) => {
                        const photos = mars.photos
                        if(photos.length > 0) {
                            const photo = photos[Math.floor(Math.random() * photos.length)]
                            resolve(photo)
                        }
                        else if(attempts < 3) {
                            url = generateUrl()
                            GetObject()
                        }
                        else {
                            console.warn(`Error resolving request: ${response.status}`)
                            reject("kitten.png")
                        }
                    })
                    .catch((error)=>{
                        console.warn(`Error resolving request: ${error.message}`)
                        reject("kitten.png")
                    })
                }
                else if(attempts < 3) {
                    attempts++;
                    GetObject()
                }
                else {
                    console.warn(`Error resolving request: ${response.status}`)
                    reject("kitten.png")
                }               
            })
            .catch((error)=>{
                if(attempts < 3)
                {
                    attempts++;
                    GetObject()
                }
                else
                {
                    console.warn(`Unable to make request: ${error.message}`)
                    reject("kitten.png")
                } 
            });
        }

        GetObject()
    })
}

function generateUrl() {
    const curiosity = {
        name: "curiosity",
        cams: ['FHAZ','RHAZ','MAST','CHEMCAM','MAHLI','MARDI','NAVCAM']
    }
    const opportunity = {
        name: "opportunity",
        cams: ['FHAZ','RHAZ','NAVCAM','PANCAM','MINITES']
    }
    const spirit = {
        name: "spirit",
        cams: ['FHAZ','RHAZ','NAVCAM','PANCAM','MINITES']
    }
    
    const rovers = [curiosity,opportunity,spirit]

    const rover = rovers[Math.floor(Math.random() * rovers.length)]
    const name = rover.name
    const roverCams = rover.cams
    const camera = roverCams[Math.floor(Math.random() * roverCams.length)]
    const sol = Math.floor(Math.random() * 500)
    
    const params = {
        sol: sol,
        camera: camera,
        api_key: key  
    }

    const queryString = new URLSearchParams(params).toString();

    return `https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?${queryString}`
}


