<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Stickerkaart Nederland</title>

<link rel="stylesheet"
href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f3f4f6;
}

/* BOVENBALK */

#topbar {
  height: 65px;
  background: white;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 15px;

  box-shadow: 0 2px 8px rgba(0,0,0,.15);

  position: relative;
  z-index: 3000;
}

#logo {
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
}

#search {
  flex: 1;

  padding: 11px 14px;

  border: 1px solid #ccc;
  border-radius: 9px;

  font-size: 15px;
}

#searchBtn {
  border: none;

  background: #1976d2;
  color: white;

  padding: 11px 16px;

  border-radius: 9px;

  cursor: pointer;
}

#addBtn {
  width: 45px;
  height: 45px;

  border: none;
  border-radius: 50%;

  background: #1976d2;
  color: white;

  font-size: 30px;

  cursor: pointer;
}

/* TELLER */

#counter {
  position: fixed;

  top: 80px;
  right: 15px;

  z-index: 2000;

  background: white;

  padding: 12px 17px;

  border-radius: 12px;

  box-shadow: 0 3px 12px rgba(0,0,0,.25);

  font-weight: bold;
}

/* KAART */

#map {
  width: 100%;
  height: calc(100vh - 65px);
}

/* MIDDEN KRUIS */

#centerMarker {
  display: none;

  position: fixed;

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);

  z-index: 1500;

  pointer-events: none;

  color: red;

  font-size: 48px;

  text-shadow:
    0 0 5px white,
    0 0 10px white;
}

/* PLAATS BAR */

#placeBar {
  display: none;

  position: fixed;

  left: 50%;
  bottom: 20px;

  transform: translateX(-50%);

  z-index: 4000;

  background: white;

  padding: 13px;

  border-radius: 14px;

  box-shadow: 0 5px 25px rgba(0,0,0,.3);

  text-align: center;
}

#placeBar button {
  border: none;

  padding: 11px 16px;

  margin: 4px;

  border-radius: 8px;

  cursor: pointer;

  font-weight: bold;
}

#placeHere {
  background: #16a34a;
  color: white;
}

#cancelPlace {
  background: #ddd;
}

/* STICKER */

.sticker {
  width: 60px;
  height: 60px;

  background: #ffe600;

  border: 3px solid #c5b400;

  border-radius: 50%;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 6px;

  text-align: center;

  font-size: 12px;
  font-weight: bold;

  color: #222;

  box-shadow: 0 4px 10px rgba(0,0,0,.35);

  overflow: hidden;

  word-break: break-word;
}

/* MELDING */

#notification {
  display: none;

  position: fixed;

  top: 75px;
  right: 20px;

  z-index: 10000;

  background: #222;

  color: white;

  padding: 15px 20px;

  border-radius: 13px;

  box-shadow: 0 5px 20px rgba(0,0,0,.35);

  font-weight: bold;
}

/* MODAL */

#modalBackground {
  display: none;

  position: fixed;

  inset: 0;

  background: rgba(0,0,0,.45);

  z-index: 5000;
}

#modal {
  display: none;

  position: fixed;

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);

  width: 330px;

  background: white;

  padding: 22px;

  border-radius: 15px;

  z-index: 5001;

  box-shadow: 0 10px 40px rgba(0,0,0,.4);
}

#modal input {
  width: 100%;

  padding: 12px;

  border: 1px solid #ccc;

  border-radius: 8px;

  font-size: 16px;
}

.modalButtons {
  display: flex;

  gap: 8px;

  margin-top: 15px;
}

.modalButtons button {
  flex: 1;

  padding: 11px;

  border: none;

  border-radius: 8px;

  cursor: pointer;

  font-weight: bold;
}

#publish {
  background: #1976d2;
  color: white;
}

#cancel {
  background: #ddd;
}

.delete {
  width: 100%;

  padding: 9px;

  border: none;

  border-radius: 7px;

  background: #e53935;

  color: white;

  cursor: pointer;

  font-weight: bold;
}
</style>
</head>

<body>

<div id="topbar">

  <div id="logo">
    📍 Stickerkaart
  </div>

  <input
    id="search"
    placeholder="🔎 Zoek plaats..."
  >

  <button
    id="searchBtn"
    onclick="searchPlace()"
  >
    Zoek
  </button>

  <button
    id="addBtn"
    onclick="startPlacement()"
  >
    +
  </button>

</div>


<div id="counter">

  🏷️ Stickers:
  <span id="stickerCount">0</span>

</div>


<div id="map"></div>


<div id="centerMarker">
  ✚
</div>


<div id="placeBar">

  <div>
    📍 Zet het kruis op de gewenste plek
  </div>

  <button
    id="placeHere"
    onclick="chooseLocation()"
  >
    📌 Sticker hier
  </button>

  <button
    id="cancelPlace"
    onclick="cancelPlacement()"
  >
    Annuleren
  </button>

</div>


<div id="notification">

  🔥 Sticker has been placed!<br>
  sheesh 😎

</div>


<div id="modalBackground"></div>


<div id="modal">

  <h2>🏷️ Sticker maken</h2>

  <p>
    Wat moet er op de sticker staan?
  </p>

  <input
    id="stickerText"
    maxlength="40"
    placeholder="Bijvoorbeeld: Heerenveen"
  >

  <div class="modalButtons">

    <button
      id="publish"
      onclick="publishSticker()"
    >
      Publiceren
    </button>

    <button
      id="cancel"
      onclick="closeModal()"
    >
      Annuleren
    </button>

  </div>

</div>


<script
src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js">
</script>


<script>

/* KAART START OP HEERENVEEN */

const map = L.map("map", {
  doubleClickZoom: false
}).setView(
  [52.9593, 5.9185],
  12
);


L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,

    attribution:
      "&copy; OpenStreetMap contributors"
  }
).addTo(map);


/* DATA */

let stickers = [];

let selectedLat = null;
let selectedLng = null;


/* DATA LADEN */

try {

  stickers = JSON.parse(
    localStorage.getItem(
      "stickerkaart"
    ) || "[]"
  );

} catch {

  stickers = [];

}


/* PLUS */

function startPlacement() {

  document.getElementById(
    "centerMarker"
  ).style.display = "block";

  document.getElementById(
    "placeBar"
  ).style.display = "block";

}


/* LOCATIE */

function chooseLocation() {

  const center =
    map.getCenter();

  selectedLat =
    center.lat;

  selectedLng =
    center.lng;


  document.getElementById(
    "centerMarker"
  ).style.display = "none";

  document.getElementById(
    "placeBar"
  ).style.display = "none";


  document.getElementById(
    "modalBackground"
  ).style.display = "block";

  document.getElementById(
    "modal"
  ).style.display = "block";


  document.getElementById(
    "stickerText"
  ).value = "";

  document.getElementById(
    "stickerText"
  ).focus();

}


/* ANNULEREN */

function cancelPlacement() {

  document.getElementById(
    "centerMarker"
  ).style.display = "none";

  document.getElementById(
    "placeBar"
  ).style.display = "none";

}


/* PUBLICEREN */

function publishSticker() {

  const input =
    document.getElementById(
      "stickerText"
    );

  const text =
    input.value.trim();


  if (!text) {

    alert(
      "Vul eerst een tekst in."
    );

    input.focus();

    return;
  }


  if (
    selectedLat === null ||
    selectedLng === null
  ) {

    alert(
      "Kies eerst een locatie."
    );

    return;
  }


  const sticker = {

    id:
      Date.now().toString(),

    text:
      text,

    lat:
      selectedLat,

    lng:
      selectedLng,

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


  showNotification();

}


/* STICKER */

function createSticker(sticker) {

  const icon =
    L.divIcon({

      className: "",

      html:
        '<div class="sticker">' +
        escapeHtml(sticker.text) +
        '</div>',

      iconSize: [60,60],

      iconAnchor: [30,30]

    });


  const marker =
    L.marker(
      [sticker.lat, sticker.lng],
      { icon: icon }
    ).addTo(map);


  const date =
    new Date(
      sticker.created
    );


  const dateText =
    date.toLocaleDateString(
      "nl-NL",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );


  marker.bindPopup(

    "<div style='min-width:220px'>" +

    "<h3>🏷️ " +
    escapeHtml(sticker.text) +
    "</h3>" +

    "<b>📍 Locatie</b><br>" +

    sticker.lat.toFixed(5) +
    ", " +
    sticker.lng.toFixed(5) +

    "<br><br>" +

    "<b>📅 Aangemaakt</b><br>" +

    dateText +

    "<br><br>" +

    "<button class='delete' " +
    "onclick=\"deleteSticker('" +
    sticker.id +
    "')\">" +

    "🗑️ Deze sticker verwijderen" +

    "</button>" +

    "</div>"
  );


  sticker.marker = marker;

}


/* VERWIJDEREN */

function deleteSticker(id) {

  const index =
    stickers.findIndex(
      sticker =>
        sticker.id === id
    );


  if (index === -1) {
    return;
  }


  if (
    !confirm(
      "Deze sticker verwijderen?"
    )
  ) {

    return;
  }


  if (
    stickers[index].marker
  ) {

    map.removeLayer(
      stickers[index].marker
    );

  }


  stickers.splice(
    index,
    1
  );


  localStorage.setItem(
    "stickerkaart",
    JSON.stringify(stickers)
  );


  updateCounter();

}


/* TELLER */

function updateCounter() {

  document.getElementById(
    "stickerCount"
  ).textContent =
    stickers.length;

}


/* MELDING */

function showNotification() {

  const notification =
    document.getElementById(
      "notification"
    );


  notification.style.display =
    "block";


  setTimeout(
    function() {

      notification.style.display =
        "none";

    },
    3500
  );

}


/* MODAL SLUITEN */

function closeModal() {

  document.getElementById(
    "modal"
  ).style.display =
    "none";

  document.getElementById(
    "modalBackground"
  ).style.display =
    "none";

  selectedLat = null;
  selectedLng = null;

}


/* ZOEKEN */

function searchPlace() {

  const query =
    document.getElementById(
      "search"
    ).value.trim();


  if (!query) {
    return;
  }


  fetch(
    "https://nominatim.openstreetmap.org/search" +
    "?format=json" +
    "&countrycodes=nl" +
    "&limit=1" +
    "&q=" +
    encodeURIComponent(query)
  )

  .then(response =>
    response.json()
  )

  .then(data => {

    if (!data.length) {

      alert(
        "Plaats niet gevonden."
      );

      return;
    }


    map.setView(
      [
        Number(data[0].lat),
        Number(data[0].lon)
      ],
      14
    );

  })

  .catch(() => {

    alert(
      "Zoeken mislukt."
    );

  });

}


/* ENTER ZOEKEN */

document
  .getElementById("search")
  .addEventListener(
    "keydown",
    function(event) {

      if (
        event.key === "Enter"
      ) {

        searchPlace();

      }

    }
  );


/* ENTER PUBLICEREN */

document
  .getElementById("stickerText")
  .addEventListener(
    "keydown",
    function(event) {

      if (
        event.key === "Enter"
      ) {

        event.preventDefault();

        publishSticker();

      }

    }
  );


/* VEILIGE TEKST */

function escapeHtml(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


/* BESTAANDE STICKERS */

stickers.forEach(
  sticker =>
    createSticker(sticker)
);


updateCounter();

</script>

</body>
</html>
