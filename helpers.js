
export const setStorage = (data) => {
   
    const strData = JSON.stringify(data)  // data yi stringe cevirdik localStorage'a eklemeden once

    // veriyi local storage'ye gonderdik
    localStorage.setItem("notes",strData)
}

var carIcon = L.icon({
    iconUrl: './icons/car.png',
    iconSize: [40, 50],
})
var homeIcon = L.icon({
    iconUrl: './icons/home-marker.png',
    iconSize: [40, 50],
})
var jobIcon = L.icon({
    iconUrl: './icons/job.png',
    iconSize: [40, 50],
})
var visitIcon = L.icon({
    iconUrl: './icons/visit.png',
    iconSize: [40, 50],
})


export function detecIcon(type){
   
    switch(type){
        case "park" :
            return carIcon 

        case "home":
            return homeIcon 
            
        case "job" :
            return jobIcon 
            
        case "visit" :
            return visitIcon
    }
}

 export const detecType = (type) => {
    switch(type){
        case "park":
            return "Parking "
        case "home":
            return "Home"    
        case "job":
            return "Work"  
        case "visit":
            return "Visit"      
    }
}