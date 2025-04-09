<template>
    <div class="container">
        <!-- <div class="select">
            <v-select
                v-model="selectedItems"
                :items="selectMenu"
                item-title="name"
                label="Select item"
                multiple
                chips
                hint="Välj en eller flera kryssrutor"
            ></v-select>
        </div> -->
<!--         <div class="legend">
            <p v-for="marker in markers"><span class="box" :style="{backgroundColor: marker.color}"></span>{{marker.item}}</p>
        </div> -->
         <div id="map">map</div>
    </div>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css"
import L from 'leaflet';
import { onMounted, ref } from 'vue';
import { type BingoItem } from '../types';
import { getBingoItemById, getBingoItems } from '../db';


const items = ref<BingoItem[]>([]);
const item = ref<BingoItem>();
const selectMenu = ref<{name: string, id: string}[]>([]);
const selectedItems = ref<BingoItem[]>([]);
const markers = ref<{color: string, item: string, id: string}[]>([]);


onMounted(async () => {
    const map = L.map('map').setView([57.71947276091643, 11.94729384049893], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    //then fetch all items
    items.value = await getBingoItems();
    
    //then set markers
    items.value.forEach(item => {
        //set random marker icon
        const leafletColors = ['red', 'blue', 'green', 'yellow', 'orange', 'black',];
        const randomcolor = leafletColors[Math.floor(Math.random() * leafletColors.length)]
        const icon = L.icon({
            iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${randomcolor}.png`,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
            iconSize: [15, 25],
            iconAnchor: [12, 25],
            popupAnchor: [1, -34],
            shadowSize: [25, 25]
        });
        if(item.locations) {
            markers.value.push({
            color: randomcolor,
            item: item.item,
            id: item.id
        });
            item.locations.forEach(location => {
                var marker = L.marker([location.lat, location.long], {
                    icon: icon
                })
                .addTo(map);
                marker.bindPopup(`<b>${item.item}</b>`).openPopup();
        });
        //remove markers with no locations
        } else {
            markers.value = markers.value.filter(marker => marker.id !== item.id);

    }
    });
});


// watch(() => selectedItems, () => {
//     markers.value = [];
//     selectedItems.value.forEach(item => {
//         items.value.forEach(bingoItem => {
//             if(bingoItem.id === item.id) {
//                 bingoItem.locations?.forEach(location => {
//                     markers.value.push({
//                         color: '#' + Math.floor(Math.random()*16777215).toString(16),
//                         item: bingoItem.item
//                     });
//                 });
//             }
//         });
//     });
// });

</script>

<style scoped>
.container {
    text-align: center;
    width: 100vw;
    height: 100vh;
}

#map {
    width: 100%;
    height: 100%;
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