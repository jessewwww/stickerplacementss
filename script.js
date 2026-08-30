const map = L.map("map")
.setView([52.9593,5.9185],13);


L.tileLayer(
"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
{
maxZoom:19,
attribution:"© OpenStreetMap"
}
).addTo(map);



let stickers=[];

let placing=false;

let selected=null;



let saved =
localStorage.getItem("stickers");


if(saved){

stickers=JSON.parse(saved);

stickers.forEach(addSticker);

}


updateCounter();



function startPlace(){

placing=true;

document.getElementById("marker")
.style.display="block";


document.getElementById("confirmBox")
.style.display="flex";

}



function cancelPlace(){

placing=false;


document.getElementById("marker")
.style.display="none";


document.getElementById("confirmBox")
.style.display="none";

}



function selectPlace(){

let center=map.getCenter();


selected={
lat:center.lat,
lng:center.lng
};


document.getElementById("marker")
.style.display="none";


document.getElementById("confirmBox")
.style.display="none";


document.getElementById("popup")
.style.display="block";

}



function saveSticker(){

let text=document
.getElementById("text")
.value
.trim();


if(!text){

alert("Schrijf iets");

return;

}



let sticker={

id:Date.now(),

text:text,

lat:selected.lat,

lng:selected.lng,

date:new Date().toISOString()

};



stickers.push(sticker);


localStorage.setItem(
"stickers",
JSON.stringify(stickers)
);



addSticker(sticker);

updateCounter();


document.getElementById("popup")
.style.display="none";


document.getElementById("text")
.value="";


}



function addSticker(s){


let icon=L.divIcon({

className:"",

html:
`
<div class="sticker">
${s.text}
</div>
`

});


let marker=L.marker(

[
s.lat,
s.lng
],

{
icon:icon
}

)
.addTo(map);



marker.bindPopup(

`

<b>${s.text}</b>

<br>

📅 ${
new Date(s.date)
.toLocaleString("nl-NL")
}


<br><br>

<button onclick="removeSticker(${s.id})">

🗑️ Verwijderen

</button>

`

);


s.marker=marker;

}




function removeSticker(id){


stickers=
stickers.filter(
x=>x.id!==id
);


localStorage.setItem(
"stickers",
JSON.stringify(stickers)
);


location.reload();

}



function updateCounter(){

document
.getElementById("counter")
.innerHTML=
stickers.length;

}




async function searchPlace(){


let q=
document
.getElementById("search")
.value;


let response=
await fetch(

"https://nominatim.openstreetmap.org/search?format=json&q="
+
encodeURIComponent(q)

);


let data=
await response.json();



if(data.length){

map.setView(

[
Number(data[0].lat),
Number(data[0].lon)
],

15

);

}

}
