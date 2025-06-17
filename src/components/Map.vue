// @ts-nocheck

<template>
    <div class="map-wrapper">
      <div id="map"></div>
      <!-- only show when there are no items -->
      <div v-if="items.length === 0" class="map-overlay">
        INGA FLAGGOR ATT TA ÖVER! MEN HÅLL KOLL!
      </div>
    <!-- Floating legend -->
    <div class="map-legend" v-if="items.length">
      <ul class="legend-list">
        <li v-for="item in items" :key="item.id" class="legend-item">
          {{ item.name }}
          <v-icon color="black" small @click="zoomToPlace(item)">mdi-crosshairs-gps</v-icon>
        </li>
      </ul>
    </div>
  </div>

  <!-- Optional: other static page info -->
  <div class="info">
    <p>Se <router-link to="/team">alla medlemmar</router-link></p>
  </div>
  </template>
  
  <script setup>
  import "leaflet/dist/leaflet.css"
  import L from 'leaflet';
  import { onMounted, ref } from 'vue';
  //import { type BingoItem } from '../types';
  import { getTeamFlags, getBingoItemById } from '../db';
  import { useBingoStore } from '../stores';
  import { onBeforeMount } from 'vue';
  import redFlag from '@/assets/redFlag.png';
  import outlineFlag from '@/assets/whiteFlag.png';

  
  const items = ref([])
  const store = useBingoStore();

  //different icons for different teams
  const redFlagIcon = L.icon({
    iconSize: [32, 52],               // adjust to your font-size
    iconAnchor: [28,52],         // bottom-center the “point”
    iconUrl: redFlag //
  });
  const outlineFlagIcon = L.icon({
    iconSize: [32, 52],
    iconAnchor: [28, 52],
    iconUrl: outlineFlag, 
  });

  let map = ref(null);

  // Zoom function
  function zoomToPlace(item) {
    const lat = item.location.latitude || item.location._lat;
    const lng = item.location.longitude || item.location._long;

    if (map.value) {
      map.value.setView([lat, lng], 18, { animate: true });
    }
  }

  //before mount, get team from local Storage and fetch flags
  onBeforeMount(() => {
    const userTeam = localStorage.getItem('team');
    if (!userTeam) {
      console.error('No team found in localStorage');
      return;
    }
    else {
      store.team = userTeam; // set the team in the store
    }
  });
  
  onMounted(async () => {
    map.value = L.map('map', {
    // dragging: false,            // disable drag/pan
    // scrollWheelZoom: false,     // disable mouse wheel zoom
    // //doubleClickZoom: false,     // optional
    // boxZoom: false,             // optional
    // keyboard: false,            // optional
    // tap: false,                 // disable tap-based drag on touch
    touchZoom: true             // allow pinch zoom!
  }).setView([57.71760575194973, 11.948177775196955], 15);

    //set max zoom out
    map.value.setMinZoom(15);

    if (map.value) {
      L.tileLayer(`https://api.maptiler.com/maps/streets-v2-light/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAP_TILE_KEY}`, {
        maxZoom: 19,
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
      }).addTo(map.value);
    }
    
    //add the kville border tiles
    L.tileLayer('/tiles/{z}/{x}/{y}.png', {
      tms: false,       // Use true only if your tile folder is flipped Y-wise
      maxZoom: 19,
      opacity: 0.8      // Adjust overlay visibility
    }).addTo(map.value);

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
      item.name = name.item; // add the name to the item
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
      radius: 30, color: '#6900FF', fillColor: '#6900FF', fillOpacity: 0.2
    }).addTo(map.value);
     
    });
  });

 
  </script>
  
  <style scoped>
.map-wrapper {
  position: relative;
  width: 100vw;
  height: 600px;
  margin: 5px;
}

#map {
  width: 98%;
  height: 100%;
  /* make this a stacking context so your overlay’s z-index is relative to it */
  position: relative;
  z-index: 0;
  touch-action: pinch-zoom;
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

.custom-flag-icon {
  background: transparent !important;
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

li {
  float: left;
  justify-content: center;
}

li .v-icon {
  padding-left: 20px;
}

ul {
  border: none
}

.map-legend {
  position: absolute;
  bottom: 20px;
  right: 10px;
  background: rgba(255, 255, 255, 0.7); /* more transparent */
  padding: 8px 10px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  z-index: 1000;
  font-size: 0.85rem;
  max-width: 180px;
}

.legend-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.legend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;               /* optional: adds breathing room */
  padding: 2px 0;
  white-space: nowrap;    /* keeps text in one line */
}

.legend-item span {
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.legend-item .v-icon {
  font-size: 14px; /* smaller icon */
  cursor: pointer;
  padding-left: 8px;
}

.mdi:before, .mdi-set {
  font-size: 1.3rem;
}
  </style>
  