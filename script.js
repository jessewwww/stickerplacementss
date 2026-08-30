const map = L.map("map", {
  doubleClickZoom: false
}).setView([52.9593, 5.9185], 12);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }
).addTo(map);


let stickers = [];

let selectedLat = null;
let selectedLng = null;


// Oude stickers laden
const saved = localStorage.getItem("stickerkaart");

if (saved) {
  try {
    stickers = JSON.parse(saved);

    if (!Array.isArray(stickers)) {
      stickers = [];
    }
  } catch (error) {
    console.error("Fout bij laden stickers:", error);
    stickers = [];
  }
}


// Bestaande stickers tonen
stickers.forEach(function (sticker) {
  createSticker(sticker);
});

updateCounter();


// ================================
// PLAATSING STARTEN
// ================================

function startPlacement() {
  document.getElementById("centerMarker").style.display = "block";
  document.getElementById("placeBar").style.display = "block";
}


// ================================
// PLAATSING ANNULEREN
// ================================

function cancelPlacement() {
  document.getElementById("centerMarker").style.display = "none";
  document.getElementById("placeBar").style.display = "none";
}


// ================================
// LOCATIE KIEZEN
// ================================

function chooseLocation() {
  const center = map.getCenter();

  selectedLat = center.lat;
  selectedLng = center.lng;

  document.getElementById("centerMarker").style.display = "none";
  document.getElementById("placeBar").style.display = "none";

  document.getElementById("modalBackground").style.display = "block";
  document.getElementById("modal").style.display = "block";
}


// ================================
// STICKER PUBLICEREN
// ================================

async function publishSticker() {

  const text = document
    .getElementById("stickerText")
    .value
    .trim();


  if (!text) {
    alert("Vul tekst in");
    return;
  }


  if (selectedLat === null || selectedLng === null) {
    alert("Kies eerst plek");
    return;
  }


  // Animatie starten
  document.getElementById("saveOverlay").style.display = "flex";

  document.getElementById("loadingCircle").style.display = "block";
  document.getElementById("saveTitle").style.display = "block";
  document.getElementById("saveSub").style.display = "block";

  document.getElementById("successIcon").style.display = "none";
  document.getElementById("successTitle").style.display = "none";
  document.getElementById("successSub").style.display = "none";


  // Nieuwe sticker
  const sticker = {
    id: Date.now().toString(),
    text: text,
    lat: selectedLat,
    lng: selectedLng,
    created: new Date().toISOString()
  };


  // Wachten voor animatie
  await new Promise(function (resolve) {
    setTimeout(resolve, 5000);
  });


  // Toevoegen
  stickers.push(sticker);


  // Opslaan
  localStorage.setItem(
    "stickerkaart",
    JSON.stringify(stickers)
  );


  // Tonen
  createSticker(sticker);

  updateCounter();


  // Succes animatie
  document.getElementById("loadingCircle").style.display = "none";
  document.getElementById("saveTitle").style.display = "none";
  document.getElementById("saveSub").style.display = "none";

  document.getElementById("successIcon").style.display = "block";
  document.getElementById("successTitle").style.display = "block";
  document.getElementById("successSub").style.display = "block";


  await new Promise(function (resolve) {
    setTimeout(resolve, 2000);
  });


  document.getElementById("saveOverlay").style.display = "none";

  closeModal();

  showNotification();
}


// ================================
// STICKER MAKEN
// ================================

function createSticker(sticker) {

  const icon = L.divIcon({
    className: "",
    html:
      `<div class="sticker">${escapeHtml(sticker.text)}</div>`,
    iconSize: [62, 62],
    iconAnchor: [31, 31]
  });


  const marker = L.marker(
    [
      Number(sticker.lat),
      Number(sticker.lng)
    ],
    {
      icon: icon
    }
  ).addTo(map);


  const date = new Date(sticker.created)
    .toLocaleDateString("nl-NL");


  marker.bindPopup(`

    <h3>🏷️ ${escapeHtml(sticker.text)}</h3>

    📍 Locatie:<br>

    ${Number(sticker.lat).toFixed(5)},
    ${Number(sticker.lng).toFixed(5)}

    <br><br>

    📅 ${date}

    <br><br>

    <button
      class="delete"
      onclick="deleteSticker('${sticker.id}')"
    >
      🗑️ Verwijderen
    </button>

  `);
}


// ================================
// STICKER VERWIJDEREN
// ================================

function deleteSticker(id) {

  stickers = stickers.filter(function (sticker) {
    return sticker.id !== id;
  });


  localStorage.setItem(
    "stickerkaart",
    JSON.stringify(stickers)
  );


  location.reload();
}


// ================================
// TELLER
// ================================

function updateCounter() {

  document.getElementById("stickerCount").textContent =
    stickers.length;
}


// ================================
// MODAL SLUITEN
// ================================

function closeModal() {

  document.getElementById("modal").style.display = "none";

  document.getElementById("modalBackground").style.display = "none";

  selectedLat = null;
  selectedLng = null;
}


// ================================
// NOTIFICATIE
// ================================

function showNotification() {

  const n = document.getElementById("notification");

  n.style.display = "block";


  setTimeout(function () {

    n.style.display = "none";

  }, 3500);
}


// ================================
// PLAATS ZOEKEN
// ================================

function searchPlace() {

  const q = document
    .getElementById("search")
    .value
    .trim();


  if (!q) {
    return;
  }


  fetch(
    "https://nominatim.openstreetmap.org/search" +
    "?format=json" +
    "&countrycodes=nl" +
    "&q=" +
    encodeURIComponent(q)
  )

    .then(function (response) {
      return response.json();
    })

    .then(function (data) {

      if (data.length > 0) {

        map.setView(
          [
            Number(data[0].lat),
            Number(data[0].lon)
          ],
          14
        );

      } else {

        alert("Locatie niet gevonden.");

      }

    })

    .catch(function (error) {

      console.error("Zoekfout:", error);

      alert("Er ging iets mis bij het zoeken.");

    });
}


// ================================
// HTML VEILIG MAKEN
// ================================

function escapeHtml(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}
