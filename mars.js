import { key } from "./key.js";

window.addEventListener("DOMContentLoaded", Mars())

function Mars() {
    GetMarsImage()

    setInterval(()=>{
        GetMarsImage()
    }, 9000)
}

function GetMarsImage() {

    for(let i = 1;i<=3;i++)
    {
        GetImageObject()
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

}

function GetImageObject()
{
    let attempts = 0;
    let url = generateUrl()

    return new Promise((resolve, reject)=>{
        function GetObject(){
        
            fetch(url)
            .then((response) => {
                if(response.ok)
                {
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

    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?${queryString}`

    return url
}


