import { detecIcon, detecType, setStorage } from "./helpers.js";

// html den gelenler 
const form = document.querySelector("form")
const list = document.querySelector("ul")

// ortak kullanim alani (globalde tanimladiklarimiz)
let map;
let coords = []
let notes = JSON.parse(localStorage.getItem("notes")) || [] ;   // local storagede veri varsa  bunu json verisine cevir ve  ver, yoksa bunu bos dizin olarak baslat.
let layerGroup = []

// console.log(JSON.parse(localStorage.getItem("notes")))   //  local storage 'taki veriyi json verisine donusturduk parse ile


// kullanicinin konumunu alma
navigator.geolocation.getCurrentPosition(
    loadMap,
    console.log("kullanici kabul etmedi"))



    // kullanicinin konumuna gore ekrana haritayi gosterme 
function loadMap(e){
 
    //haritanin kurulumu
    map = new L.map("map").setView([e.coords.latitude, e.coords.longitude],10)
 L.control;

    // haritanin nasil gozukecegini belirler(leaflet dokumantosyandan aldik)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

  //haritada bir tiklanma oldugunda calisacak fonksiyon
    map.on("click", onMapClick)

    // Haritada ekrana basilacak imlecleri tutacagimiz katman
    layerGroup  = L.layerGroup().addTo(map)

    // lokalden gelen note'lari listeleme / sayfa yenilendiginde silinmiyor 
    renderNoteList(notes)
}

// haritaya tiklaninca calisir
function onMapClick(e){
   
    form.style.display = "flex"           // haritaya tiklaninca form alani gorunur olacak
    coords = [e.latlng.lat, e.latlng.lng]    // tiklanan alanin kordinarlari coords'a tanimlandi 
    

}
  
//form gonderildiginde calisir
function handleSubmit (e){
    e.preventDefault();


   const desc = e.target[0].value
   const date = e.target[1].value
   const status = e.target[2].value

   // notes dizisine eleman ekleme
  notes.push({id:new Date().getTime(),desc,date,status,coords })
  console.log(notes)

  setStorage(notes)        // setstoragenin icine notes verilerini gonderdik,ls guncelleme

  renderNoteList(notes)   // notlari ekrana aktarabilmek icin fonksiyona notes dizinini parametre olarak gonderdik
 
  form.style.display ="none"  // form gonderildikten sonra gorunurlugu none olacak

}

function renderNoteList(item){
   list.innerHTML = ""      // icini bos yaptik

   layerGroup.clearLayers()   // notlardan silindiginde harita ustundeki iconlarida(marker) siler.

   item.forEach((item) => {
    const listElement = document.createElement("li")
    
    listElement.dataset.id = item.id      //  datasina sahip oldugu id'yi ekleme (olusturulan li etiketine id ekledik)
    
    listElement.innerHTML =`
    <div>
    <p>${item.desc}</p>
    <p><span>Date: </span>${item.date}</p>
    <p><span>Reason: </span>${detecType(item.status)}</p>
    </div>
  <i class="bi bi-x" id="delete"></i>
  <i class="bi bi-airplane-fill" id="fly"></i>`;

  list.insertAdjacentElement("afterbegin", listElement)   //  forma girilen bilgileri ekrana getiriyor ve son eklenen  listede en ustte gozukuyor

  // ekrana marker basma 
  renderMarker(item)


   });
}

// ekrana marker basma 
function renderMarker(item){
   

    L.marker(item.coords,{icon:detecIcon(item.status)})    // marker'i olusturur
    .addTo(layerGroup)              // imleclerin oldugu katmana ekler
    .bindPopup(`${item.desc}`)        //uzerine tiklaninca acilacak popup ekleme
}


function handleClick(e){   
    console.log(e.target.id)
    const id = e.target.parentElement.dataset.id  // silinecek(guncellenecek) elemanin id'sine ulasma .
    console.log(notes)
    if(e.target.id === "delete"){
       
       notes = notes.filter((note) =>  note.id != id)  // id'sini bildigimiz elemani filter ile diziden kaldiririz.
        console.log(notes)

        setStorage(notes)    // local Storage'tanda silinmesi(guncellenmesi) icin notes'u tekrar setStorage'a gonderdik
   
        renderNoteList(notes)   // ekrani gunceller
    }

    if(e.target.id === "fly"){
        const note = notes.find((note) => note.id == id)

        map.flyTo(note.coords)

        console.log(note)
    }

}


//! olay izleyicileri 
form.addEventListener("submit" , handleSubmit)
list.addEventListener("click", handleClick)