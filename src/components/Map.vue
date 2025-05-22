// @ts-nocheck

<template>
    <div class="map-wrapper">
      <div id="map"></div>
      <!-- only show when there are no items -->
      <div v-if="items.length === 0" class="map-overlay">
        INGA FLAGGOR ATT TA ÖVER! MEN HÅLL KOLL!
      </div>
    </div>
    <div class="info">
      <p>Du är medlem i det <span v-if="store.team == 'redTeam'">RÖDA LAGET</span><span v-else>VITA LAGET</span> och ni ska ta det andra lagets flaggor!</p>
      <p>Detta görs genom att stå inom flaggans radie och lyckas kryssa samma sak som laget som tog flaggan gjorde.</p>
      <p>Ni samlar poäng ihop och vinner fina priser i grupp!</p>
      <p>Se <router-link to="/team"> alla medlemmar</router-link></p>
      <h2 v-if="store.team == 'whiteTeam'">Röda flaggor</h2>
      <h2 v-else>Vita flaggor</h2>
      <span v-if="items.length === 0">Inga flaggor att ta just nu!</span>
      <ul class="list-group">
        <li v-for="item in items" :key="item.id" class="list-group-item">
          {{ item.location.latitude }}, {{ item.location.longitude }} <v-icon color="black" @click="zoomToPlace(item)">mdi-crosshairs-gps</v-icon>

        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import "leaflet/dist/leaflet.css"
  import L from 'leaflet';
  import { onMounted, ref } from 'vue';
  //import { type BingoItem } from '../types';
  import { getTeamFlags, getBingoItemById } from '../db';
  import { useBingoStore } from '../stores';

  
  const items = ref([])
  const store = useBingoStore();

  //different icons for different teams
  const redFlagIcon = L.divIcon({
    className: 'leaflet-div-icon',    // suppress default icon styling
    html: '<span class="material-symbols-outlined filled">flag</span>',
    iconSize: [32, 32],               // adjust to your font-size
    iconAnchor: [16, 32],             // bottom-center the “point”
  });
  const outlineFlagIcon = L.divIcon({
    className: 'leaflet-div-icon',
    html: '<span class="material-symbols-outlined">flag</span>',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  let map = ref(null);

  // Zoom function
  function zoomToPlace(item) {
    console.log(item);
    const lat = item.location.latitude || item.location._lat;
    const lng = item.location.longitude || item.location._long;

    if (map.value) {
      map.value.setView([lat, lng], 18, { animate: true });
    }
  }
  
  onMounted(async () => {
    map.value = L.map('map').setView([57.71947, 11.94729], 16);
    if (map.value) {
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map.value);
    }
  
    const userTeam = localStorage.getItem('team');
    if (!userTeam) {
      console.error('No team found in localStorage');
      return;
    }
    items.value = await getTeamFlags(userTeam);

    // icon setup
    let icon;
    
    items.value.forEach(async item => {
      const lat = item.location.latitude || item.location._lat;
      const lng = item.location.longitude || item.location._long;
      // items.item is and name should be fetched and added to the item
      const name = await getBingoItemById(item.item);
      if (!name) {
        return;
      }
      //white team gets red flags
      if (store.team == 'whiteTeam') {
        icon = redFlagIcon;
      } else {
        icon = outlineFlagIcon;
      }
     if (!map.value) return;

    L.marker([lat, lng], { icon }).addTo(map.value)
      .bindPopup(`${name.item}`);

    L.circle([lat, lng], {
      radius: 20, color: 'red', fillColor: 'red', fillOpacity: 0.2
    }).addTo(map.value);
     
    });
  });

 
  </script>
  
  <style scoped>
.map-wrapper {
  position: relative;
  width: 100vw;
  height: 450px;
  margin: 5px;
}

#map {
  width: 98%;
  height: 100%;
  /* make this a stacking context so your overlay’s z-index is relative to it */
  position: relative;
  z-index: 0;
}

.map-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 98%;  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  /* <<< bump this way up: */
  z-index: 1000;
}

.info {
  text-align: left;
  margin: 5px;
  padding: 5px;
}

.leaflet-div-icon {
  background: none;
  border: none;
}

.leaflet-div-icon {
  display: none !important;
}
  </style>
  