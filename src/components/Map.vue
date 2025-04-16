<template>
    <div class="container">
         <div id="map">map</div>
    </div>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css"
import L from 'leaflet';
import { onMounted, ref } from 'vue';
import { type BingoItem } from '../types';
import { getBingoItemById, getTeamFlags } from '../db';
import { useBingoStore } from '../stores';


const items = ref<BingoItem[]>([]);
const item = ref<BingoItem>();
const selectMenu = ref<{name: string, id: string}[]>([]);
const selectedItems = ref<BingoItem[]>([]);
const markers = ref<{color: string, item: string, id: string}[]>([]);

const store = useBingoStore()

onMounted(async () => {
    const map = L.map('map').setView([57.71947276091643, 11.94729384049893], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    //then fetch all items
    items.value = await getTeamFlags(localStorage.getItem('team'));
    console.log(items.value);

    const redFlagIcon = L.icon({
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Red_flag_waving.svg/32px-Red_flag_waving.svg.png',
        iconSize: [32, 32], // size of the icon
        iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
    });

        // Create the white flag icon
    const whiteFlagIcon = L.icon({
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/White_flag_waving.svg/32px-White_flag_waving.svg.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
    
    //then set markers
    items.value.forEach(item => {
        const geoPoint = item.location;
        const lat = geoPoint.latitude || geoPoint._lat;
        const lng = geoPoint.longitude || geoPoint._long;

        L.marker([lat, lng], {
            icon: whiteFlagIcon,
        })
        .addTo(map)
        .bindPopup(`Flag for ${item.item}`);

        L.circle([lat, lng], {
            radius: 15,
            color: 'blue',
            fillColor: '#3f51b5',
            fillOpacity: 0.2,
        }).addTo(map);
    })
        
});


</script>

<style scoped>
.container {
    text-align: center;
    width: 100vw;
    height: 100vh;
}

#map {
    width: 100%;
    height: 450px;
}
.box {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    border: 1px solid black;
}
.legend {
    text-align: left;
    margin-top: 10px;
    margin-left: 10px;
    font-size: 10px;
}
</style>