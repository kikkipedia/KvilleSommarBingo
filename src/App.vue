<template>
      <nav>
        <ul>
            <router-link to="/"><li class="logo">Kvilles Sommarbingo <!--<span class="symbol">(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧</span>--></li></router-link>
            <li><img src="./assets/info.svg" @click="openInfo = true"></li>
            <li><img src="./assets/statistics.svg" @click="openStats = true"></li>
        </ul>
    </nav>
    <div class="main">
      <v-dialog v-model="openInfo" width="90%">
        <v-card>
          <v-btn
            icon="mdi-close"
            color="rgb(10, 150, 125)"
            @click="openInfo = false"
          ></v-btn>
          <v-card-text>
            <p>Hej {{ name }}, här kommer lite information om spelet.</p>
            <p>Spelet går ut på att samla ihop en rad av de olika händelser/personer som finns på din bricka. Nedan beskrivs de som kan vara mindre informativa.</p>
            <p>Lycka till!</p>
            <div v-for="item in descriptions">
              <h4 v-if="item.description != null">{{ item.item }}</h4>
              <p v-if="item.description != null">{{ item.description }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="openStats" width="90%">
        <v-btn
            color="rgb(10, 150, 125)"
            icon="mdi-close"
            @click="openStats = false"
          ></v-btn>
        <v-card>
          <v-card-text>
            <div><Statistics/></div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <RouterView />
    </div>
    <footer>
        <p><em>© 2024 Kvilles Sommarbingo</em>. <a href="https://github.com/kikkipedia/KvilleSommarBingo/" target="_blank">Checkout the code</a></p> 
        <p>Idé av Sikas. Kod av Kicki & Danne.</p>
    </footer>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useBingoStore } from './stores';
import { watch, ref, onMounted } from 'vue';
import {getBingoItems} from './db'
import { type BingoItem } from './types';
import Statistics from '@/components/Statistics..vue';

const store = useBingoStore()
const name = ref('')

const openInfo = ref(false)
const openStats = ref(false)
const descriptions = ref<BingoItem[]>([]) //BingoItems from database

//get name from store
watch(() => store.name, (nam) => {
    name.value = nam
})

onMounted(async () => {
  const items = await getBingoItems()
  descriptions.value = items
})

</script>

<style scoped>
nav {
    justify-content: space-between;
    background-color: white;
    width: 100% !important;
    color: #EB00D7;
    height: 60px;
    margin: auto;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
}
li {
  list-style: none;
  cursor: pointer;
  padding: 0.5rem;
  float: right;
}

li.logo {
    margin-right: auto;
    float: left;
}

.logo {
  font-family: "Chakra Petch", sans-serif;
  font-weight: 900;
  font-size: 1.5rem;
  font-style: normal;
  cursor: pointer;
}

a {
  text-decoration: none;
  color: #EB00D7;

}

li a:hover:not(.active) {
  background-color: #111;
}

.active {
  background-color: #04AA6D;
}

.main {
  background-color: white;
  margin-top: 10px;
  margin-bottom: 10px;
  min-height: calc(100vh - 110px - 1rem) !important;
}

footer {
  text-align: center;
  bottom: 0;
  height: 60px;
  width: 100% !important;
  padding: 0.5rem;
  font-size: 0.8rem;
  color: #333;
  background-color: white;
  margin: auto;
}

.symbol {
    font-size: 1rem;
    color: rgb(10, 150, 125);
    font-family: 'Courier New', Courier, monospace;
    text-align: middle;
}

h4 {
  font-size: 0.8rem;
  font-weight: bold;
  color: #EB00D7;
  padding-top: 5px
}

p {
  font-size: 0.8rem;
  color: #333;
}
</style>
