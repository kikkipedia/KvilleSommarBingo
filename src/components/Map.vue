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

         <div id="map">map</div>
    </div>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css"
import L from 'leaflet';
import { onMounted, ref } from 'vue';
import { type BingoItem } from '../types';
import { getBingoItems } from '../db';

const items = ref<BingoItem[]>([]);
const selectMenu = ref<{name: string, id: string}[]>([]);
const selectedItems = ref<BingoItem[]>([]);
const markers = ref<{color: string, item: string}[]>([]);


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
        //order items by name
        selectMenu.value.push({
            name: item.item,
            id: item.id
        });
        selectMenu.value.sort((a, b) => a.name.localeCompare(b.name));
        //set random marker color
        const color = '#' + Math.floor(Math.random()*16777215).toString(16);
        const markers = [];
        if(item.locations) {
            item.locations.forEach(location => {
                var marker = L.marker([location.lat, location.long], {
                    color: color,
                })
                .addTo(map);
        
        });
    }
    else {
        //console.log('No locations found for items');    
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
}

#map {
    height: 600px;
    max-width: 100vw;
}
</style>