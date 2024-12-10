<template>
    <div class="container">
        <div id="snow">
            <div class="bingo-box">
                <div v-if="itemNow">
                <div class="animate__animated animate__bounceInLeft item-box">
                    {{ itemNow.item }}
                </div>
            </div>
            </div>
            <div class="dragnaNr" v-if="dragnaNr.length">
                <div v-for="item in dragnaNr" :key="item.id">{{ item.item }}</div>
            </div>
        </div>
    </div>
    <footer>
        <v-btn @click="getNext()">Nästa</v-btn>
    </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getBingoItems } from '../db';
import bingoitems from '../assets/liveBingoItems.json';
import 'animate.css';

const items = ref([]);
const dragnaNr = ref([]);
const itemNow = ref();
const snowflakeCount = 100;
const randomGifs = ref([]);

onMounted(() => {
    items.value = bingoitems;
})

const getNext = () => {
    itemNow.value = null;
    const randomIndex = Math.floor(Math.random() * items.value.length);
    const randomItem = items.value[randomIndex];
    setTimeout(() => {
        
        itemNow.value = randomItem;
        
    }, 1000)
    setTimeout(() => {
        if(randomItem) {
            dragnaNr.value.push(randomItem);
            //if more than 5 items in dragnaNr, remove the first one
            if(dragnaNr.value.length > 5) {
                dragnaNr.value.shift();
            }
        }
    }, 2000)
    
    
} 
   
</script>

<style scoped>
.container {
    height: 90vh;
    width: 100vw;
    background: black;
}

footer {
  padding: 25px;
}

.bingo-box {
    background: transparent;
    width: 50%;
    height: 50%;
    margin-left: 20%;
}

.item-box {

    width: 100%;
    height: 400px;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    margin-top: 20px;
}

.dragnaNr {
  background: transparent;
  margin-left: 200px;
  padding: 10px;
  margin-right: 0px;
  width: 200px;
  border: 3px solid #0000;
  border-radius: 12px;
  color: white;
}

#snow {
    display: flex;
    align-items: center;
    display: flex;
  position: relative;
  height: 100vh; /* Adjust based on the section you want to cover */
  width: 100%;
  background: black; /* Background color, optional */
}

footer {
  background-color: black;
}
</style>