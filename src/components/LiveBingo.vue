<template>
    <div class="container">
            <div class="bingo-box">
                <div v-if="itemNow">
                <div class="animate__animated animate__bounceInLeft item-box">
                    {{ itemNow.item }}
                </div>
            </div>
            </div>
            <div class="dragnaNr" v-if="dragnaNr.length">
                <!-- only show bottom 5 in dragnaNr-->
                <div v-for="item in dragnaNr.slice(-5)" :key="item.id">{{ item.item }}</div>
                <!-- <div v-for="item in dragnaNr" :key="item.id">{{ item.item }}</div> -->
            </div>
            <div class="buttons">
                <v-btn @click="getNext()">Nästa</v-btn>
                <v-btn class="btn" @click="reset()">Reset</v-btn>
            </div>       
    </div>

        

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import bingoitems from '../assets/liveBingoItems.json';
import 'animate.css';
import type { BingoItem } from '../types';

const items = ref<BingoItem[]>([]);
const dragnaNr = ref<BingoItem[]>([]);
const itemNow = ref();

onMounted(() => {
    items.value = bingoitems as any
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
            //check if already in dragnaNr
            const alreadyDrawn = dragnaNr.value.find((item) => item.id === randomItem.id);
            if(alreadyDrawn) {
                getNext();
            }
            else {
                dragnaNr.value.push(randomItem);
                //if more than 5 items in dragnaNr, remove the first one
            }
            
        }
    }, 2000)   
} 

const reset = () => {
    dragnaNr.value = [];
    itemNow.value = null;
    items.value = bingoitems as any
}
   
</script>

<style scoped>
.main {
    padding: 0px !important;
    margin: 0px !important;
}
.container {
    height: 110vh;
    width: 100vw;
    background: black;
    align-items: center;
    display: block;
}

.bingo-box {
    display: flex;  
    width: 100%;
    height: 50%;
    justify-content: center;
    align-items: center;
}

.item-box {

    width: 100%;
    height: 400px;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    justify-content: center;
    color: white;
}

.dragnaNr {
  background: transparent;
  padding: 10px;
  display: block;
  color: white;
  align-items: center;
  font-size: 18px;
}

.buttons {
    position: absolute;
  bottom: 0;
    
}
.btn {
    margin-left: 1000px;
    background-color: red;
    color: white;
}
</style>