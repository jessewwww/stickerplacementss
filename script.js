let map;

let stickers = [];

let selectedLat = null;
let selectedLng = null;

let placing = false;

let stickerMarkers = {};


// ==============================
// GOOGLE MAPS STARTEN
// ==============================

async function initMap() {

  const { Map } =
    await google.maps.importLibrary("maps");

  const { AdvancedMarkerElement } =
    await google.maps.importLibrary("marker");


  map = new Map(
    document.getElementById("map"),
    {
      center: {
        lat: 52.9593,
        lng: 5.9185
      },

      zoom: 12,

      mapId: "DEMO_MAP_ID",

      streetViewControl: false,

      mapTypeControl: true,

      fullscreenControl: true
    }
  );


  loadStickers();

  updateCounter();
}


// ==============================
// LOCALSTORAGE LADEN
// ==============================

function loadStickers() {

  const saved =
    localStorage.getItem("stickerkaart");


  if (!saved) {
    return;
  }


  try {

    stickers = JSON.parse(saved);

    if (!Array.isArray(stickers)) {
      stickers = [];
    }

  } catch (error) {

    console.error(
      "Stickers konden niet geladen worden:",
      error
    );

    stickers = [];
  }


  stickers.forEach(
    sticker => createSticker(sticker)
  );
}


// ==============================
// STICKER PLAATSEN STARTEN
// ==============================

function startPlacement() {

  placing = true;

  document.getElementById(
    "centerMarker"
  ).style.display = "block";


  document.getElementById(
    "placeBar"
  ).style.display = "flex";

}


// ==============================
// PLAATSEN ANNULEREN
// ==============================

function cancelPlacement() {

  placing = false;

  document.getElementById(
    "centerMarker"
  ).style.display = "none";


  document.getElementById(
    "placeBar"
  ).style.display = "none";

}


// ==============================
// LOCATIE KIEZEN
// ==============================

function chooseLocation() {

  if (!map) {
    return;
  }


  const center =
    map.getCenter();


  selectedLat =
    center.lat();


  selectedLng =
    center.lng();


  document.getElementById(
    "centerMarker"
  ).style.display = "none";


  document.getElementById(
    "placeBar"
  ).style.display = "none";


  placing = false;


  document.getElementById(
    "selectedLocation"
  ).textContent =
    `📍 ${selectedLat.toFixed(5)}, ${selectedLng.toFixed(5)}`;


  document.getElementById(
    "modalBackground"
  ).style.display = "block";


  document.getElementById(
    "modal"
  ).style.display = "flex";


  document.getElementById(
    "stickerText"
  ).focus();

}


// ==============================
// STICKER OPSLAAN
// ==============================

function publishSticker() {

  const input =
    document.getElementById("stickerText");


  const text =
    input.value.trim();


  if (!text) {

    alert(
      "Vul eerst tekst voor de sticker in."
    );

    return;
  }


  if (
    selectedLat === null ||
    selectedLng === null
  ) {

    alert(
      "Er is geen locatie geselecteerd."
    );

    return;
  }


  const sticker = {

    id:
      Date.now().toString(),

    text: text,

    lat: selectedLat,

    lng: selectedLng,

    created:
      new Date().toISOString()

  };


  stickers.push(sticker);


  localStorage.setItem(
    "stickerkaart",
    JSON.stringify(stickers)
  );


  createSticker(sticker);

  updateCounter();

  closeModal();

}


// ==============================
// STICKER MAKEN
// ==============================

async function createSticker(sticker) {

  if (!map) {
    return;
  }


  const {
    AdvancedMarkerElement
  } =
    await google.maps.importLibrary(
      "marker"
    );


  const stickerElement =
    document.createElement("div");


  stickerElement.className =
    "map-sticker";


  stickerElement.textContent =
    sticker.text;


  const marker =
    new AdvancedMarkerElement({

      map: map,

      position: {
        lat: Number(sticker.lat),

        lng: Number(sticker.lng)
      },

      content: stickerElement,

      title: sticker.text

    });


  stickerMarkers[sticker.id] =
    marker;


  marker.addListener(
    "click",
    () => {

      showStickerInfo(sticker);

    }
  );

}


// ==============================
// STICKER INFO
// ==============================

function showStickerInfo(sticker) {

  const date =
    new Date(sticker.created);


  const formattedDate =
    date.toLocaleDateString(
      "nl-NL"
    );


  const formattedTime =
    date.toLocaleTimeString(
      "nl-NL",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );


  const remove =
    confirm(

      `🏷️ ${sticker.text}\n\n` +

      `📍 ${Number(sticker.lat).toFixed(5)}, ` +
      `${Number(sticker.lng).toFixed(5)}\n\n` +

      `📅 ${formattedDate}\n` +

      `🕐 ${formattedTime}\n\n` +

      `OK = verwijderen\n` +
      `Annuleren = behouden`

    );


  if (remove) {

    deleteSticker(
      sticker.id
    );

  }

}


// ==============================
// STICKER VERWIJDEREN
// ==============================

function deleteSticker(id) {

  stickers =
    stickers.filter(
      sticker =>
        sticker.id !== id
    );


  localStorage.setItem(
    "stickerkaart",
    JSON.stringify(stickers)
  );


  if (
    stickerMarkers[id]
  ) {

    stickerMarkers[id].map =
      null;


    delete stickerMarkers[id];

  }


  updateCounter();

}


// ==============================
// COUNTER
// ==============================

function updateCounter() {

  const counter =
    document.getElementById(
      "stickerCount"
    );


  counter.textContent =
    stickers.length;

}


// ==============================
// MODAL SLUITEN
// ==============================

function closeModal() {

  document.getElementById(
    "modal"
  ).style.display = "none";


  document.getElementById(
    "modalBackground"
  ).style.display = "none";


  document.getElementById(
    "stickerText"
  ).value = "";


  selectedLat = null;

  selectedLng = null;

}


// ==============================
// LOCATIE ZOEKEN
// ==============================

async function searchPlace() {

  const input =
    document.getElementById(
      "search"
    );


  const query =
    input.value.trim();


  if (!query) {
    return;
  }


  try {

    const url =
      "https://nominatim.openstreetmap.org/search" +
      "?format=json" +
      "&countrycodes=nl" +
      "&limit=1" +
      "&q=" +
      encodeURIComponent(query);


    const response =
      await fetch(url);


    const data =
      await response.json();


    if (!data.length) {

      alert(
        "Locatie niet gevonden."
      );

      return;
    }


    map.setCenter({

      lat: Number(data[0].lat),

      lng: Number(data[0].lon)

    });


    map.setZoom(15);


  } catch (error) {

    console.error(error);

    alert(
      "Zoeken mislukt."
    );

  }

}


// ==============================
// ENTER = ZOEKEN
// ==============================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    const search =
      document.getElementById(
        "search"
      );


    search.addEventListener(
      "keydown",
      function(event) {

        if (
          event.key === "Enter"
        ) {

          searchPlace();

        }

      }
    );

  }
);
