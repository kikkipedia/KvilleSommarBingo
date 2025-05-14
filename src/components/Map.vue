<template>
    <div class="map-wrapper">
      <div id="map"></div>
      <!-- only show when there are no items -->
      <div v-if="items.length === 0" class="map-overlay">
        INGA FLAGGOR ATT TA ÖVER! MEN HÅLL KOLL!
      </div>
    </div>
    <div class="info">
      <p>Se <router-link to="/team"> alla medlemmar</router-link></p>
      <h2 v-if="store.team == 'whiteTeam'">Röda flaggor</h2>
      <h2 v-else>Vita flaggor</h2>
      <ul class="list-group">
        <li v-for="item in items" :key="item.id" class="list-group-item">
          {{ item.item }} - {{ item.location.latitude }}, {{ item.location.longitude }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import "leaflet/dist/leaflet.css"
  import L from 'leaflet';
  import { onMounted, ref } from 'vue';
  import { type BingoItem } from '../types';
  import { getTeamFlags } from '../db';
  import { useBingoStore } from '../stores';
  
  const items = ref<BingoItem[]>([]);
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
  
  onMounted(async () => {
    const map = L.map('map').setView([57.71947, 11.94729], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  
    const userTeam = localStorage.getItem('team');
    if (!userTeam) {
      console.error('No team found in localStorage');
      return;
    }
    items.value = await getTeamFlags(userTeam);
  
    // icon setup
    let icon: L.DivIcon;
    
    items.value.forEach(item => {
      const lat = item.location.latitude || item.location._lat;
      const lng = item.location.longitude || item.location._long;
      //white team gets red flags
      if (store.team == 'whiteTeam') {
        icon = redFlagIcon;
      } else {
        icon = outlineFlagIcon;
      }
      L.marker([lat, lng], { icon }).addTo(map)
        .bindPopup(`Flag for ${item.item}`);
      L.circle([lat, lng], {
        radius: 20, color: 'red', fillColor: 'red', fillOpacity: 0.2
      }).addTo(map);
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
  width: 100%;
  height: 100%;
  /* make this a stacking context so your overlay’s z-index is relative to it */
  position: relative;
  z-index: 0;
}

.map-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%;  height: 100%;
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
  </style>
  