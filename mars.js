import { key } from "./key.js";

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

window.addEventListener("load", Mars())

function Mars() {
    GetMarsImage()
}

function GetMarsImage() {

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

    //TODO: HANDLE EMPTY QUERY RESULTA
    fetch(url)
    .then((response) => response.json())
    .then((mars) => {
        const photos = mars.photos

        const photo = photos[Math.floor(Math.random() * photos.length)]

        const src = photo.img_src
        const fullCamName = photo.camera.full_name
        const roverName = photo.rover.name

        document.getElementById("mars").src = src
        document.getElementById("rover-name").innerText = roverName
        document.getElementById("sol").innerText = `Sol: ${sol}`
        document.getElementById("camera").innerText = `Camera: ${fullCamName}`
    });
}


