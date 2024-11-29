<template>
    <div class="container">
        <div id="snow">
                <span
                    v-for="n in snowflakeCount"
                    :key="n"
                    class="snowflake"
                >*</span>
            <div class="bingo-box">
                <h1>Kvilles Nyårsbingo </h1>
                <div v-if="itemNow">
                <div class="animate__animated animate__bounceInLeft item-box">
                    {{ itemNow.item }}
                </div>
            </div>
            </div>
            <div class="dragnaNr">
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

onMounted(() => {
    //start snow
    const snowflakes = document.querySelectorAll('.snowflake');
    // Apply random positioning and animation delays for each snowflake
    snowflakes.forEach((flake) => {
        const flakeElement = flake as HTMLElement;
        flakeElement.style.left = `${Math.random() * 100}vw`; // Random horizontal position
        flakeElement.style.animationDuration = `${Math.random() * 3 + 5}s`; // Duration between 2s and 5s
        flakeElement.style.animationDelay = `${Math.random() * 20}s`; // Delay up to 5s
      });
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
        }
    }, 2000)
    
    
} 
   
</script>

<style scoped>
.container {
    height: 100vh;
    width: 100vw;
    background: black;
}

.bingo-box {
    background: transparent;
    width: 50%;
    height: 50%;
    margin-left: 20%;
}

.item-box {
    background-color: white;
    width: 100%;
    height: 100%;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
}

.dragnaNr {
    background: transparent;
    margin-left: 200px;
    padding: 5px;
  margin-right: 0px;
  width: 200px;
  border: 3px solid #0000;
  border-radius: 12px;
  background: linear-gradient(#131219, #131219) padding-box, linear-gradient(
        var(--angle),
        #070707,
        #687aff
      ) border-box;
  animation: 8s rotate linear infinite;
}

@keyframes rotate {
  to {
    --angle: 360deg;
  }
}

@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}


#snow {
    display: flex;
    align-items: center;
    display: flex;
  position: relative;
  overflow: hidden;
  height: 100vh; /* Adjust based on the section you want to cover */
  width: 100%;
  background: black; /* Background color, optional */
}

.snowflake {
  position: absolute;
  top: -15px; /* Start above the container */
  font-size: 24px;
  color: rgba(255, 252, 252, 0.923);
  animation: fall linear infinite;
}

/* Keyframes for falling effect */
@keyframes fall {
  0% {
    transform: translateY(-0px);
    opacity: 0.6;
  }

  10% {
    opacity: 0.1;
  }
  15% {
    opacity: 0.5;
  }
  20% {
    opacity: 0.1;
  }
  25% {
    opacity: 0.4;
  }
  30% {
    opacity: 0.1;
  }
  35% {
    opacity: 0.3;
  }
 40% {
    opacity: 0.1;
  }
 45% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.1;
  }
 55% {
    opacity: 0.3;
  }
 
  100% {
    transform: translateY(100vh); /* Move down the full height */
    opacity: 0;
  }
}

</style>