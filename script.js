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

const saved = localStorage.getItem("stickerkaart");

if (saved) {
  try {
    stickers = JSON.parse(saved);
  } catch {
    stickers = [];
  }
}

stickers.forEach(function(sticker) {
  createSticker(sticker);
});

updateCounter();

function startPlacement() {
  document.getElementById("centerMarker").style.display = "block";
  document.getElementById("placeBar").style.display = "block";
}

function cancelPlacement() {
  document.getElementById("centerMarker").style.display = "none";
  document.getElementById("placeBar").style.display = "none";
}

function chooseLocation() {
  const center = map.getCenter();

  selectedLat = center.lat;
  selectedLng = center.lng;

  document.getElementById("centerMarker").style.display = "none";
  document.getElementById("placeBar").style.display = "none";

  document.getElementById("modalBackground").style.display = "block";
  document.getElementById("modal").style.display = "block";
}

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

  document.getElementById("saveOverlay").style.display = "flex";

  document.getElementById("loadingCircle").style.display = "block";
  document.getElementById("saveTitle").style.display = "block";
  document.getElementById("saveSub").style.display = "block";

  document.getElementById("successIcon").style.display = "none";
  document.getElementById("successTitle").style.display = "none";
  document.getElementById("successSub").style.display = "none";

  const sticker = {
    id: Date.now().toString(),
    text: text,
    lat: selectedLat,
    lng: selectedLng,
    created: new Date().toISOString()
  };

  await new Promise(function(resolve) {
    setTimeout(resolve, 5000);
  });

  stickers.push(sticker);

  localStorage.setItem(
    "stickerkaart",
    JSON.stringify(stickers)
  );

  createSticker(sticker);
  updateCounter();

  document.getElementById("loadingCircle").style.display = "none";
  document.getElementById("saveTitle").style.display = "none";
  document.getElementById("saveSub").style.display = "none";

  document.getElementById("successIcon").style.display = "block";
  document.getElementById("successTitle").style.display = "block";
  document.getElementById("successSub").style.display = "block";

  await new Promise(function(resolve) {
    setTimeout(resolve, 2000);
  });

  document.getElementById("saveOverlay").style.display = "none";

  closeModal();
  showNotification();
}

function createSticker(sticker) {
  const icon = L.divIcon({
    className: "",
    html: `<div class="sticker">${escapeHtml(sticker.text)}</div>`,
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

function deleteSticker(id) {
  stickers = stickers.filter(function(sticker) {
    return sticker.id !== id;
  });

  localStorage.setItem(
    "stickerkaart",
    JSON.stringify(stickers)
  );

  location.reload();
}

function updateCounter() {
  document.getElementById("stickerCount").textContent =
    stickers.length;
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modalBackground").style.display = "none";

  selectedLat = null;
  selectedLng = null;
}

function showNotification() {
  const notification =
    document.getElementById("notification");

  notification.style.display = "block";

  setTimeout(function() {
    notification.style.display = "none";
  }, 3500);
}

function searchPlace() {
  const q = document
    .getElementById("search")
    .value
    .trim();

  if (!q) {
    return;
  }

  fetch(
    "https://nominatim.openstreetmap.org/search?format=json&countrycodes=nl&q=" +
    encodeURIComponent(q)
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.length) {
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
    .catch(function(error) {
      console.error(error);
      alert("Er ging iets mis bij het zoeken.");
    });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
