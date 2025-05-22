<template>
    <nav>
    <ul>
      <li>
        <router-link to="/" exact v-slot="{ isActive }">
          <v-icon
            large
            class="my-icon"
          >
            mdi-home-flood
          </v-icon>
        </router-link>
      </li>
      <li>
        <v-icon
          large
          class="logo"
          @click="openStats = true"
        >
          mdi-chart-box-outline
        </v-icon>
      </li>
      <li>
        <router-link to="/map" exact v-slot="{ isActive }">
          <v-icon
            large
            :class="[
              'my-icon', 
              { 'my-icon--active': isActive }
            ]"
          >
            mdi-map-legend
          </v-icon>
        </router-link>
      </li>
      <li>
        <router-link to="/team" exact v-slot="{ isActive }">
          <v-icon
            large
            :class="[
              'my-icon', 
              { 'my-icon--active': isActive }
            ]"
          >
            mdi-flag-checkered
          </v-icon>
        </router-link>
      </li>
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
            <h2>Vadå Sturis?</h2>
            <p style="color: #7400FF;">Här finns en lista som kan vara till hjälp när man inte fattar vad i helvete en ruta betyder.</p>
            <hr/>
            <div v-for="item in descriptions">
              <h4 v-if="item.description != null">{{ item.item }}</h4>
              <p v-if="item.description != null">{{ item.description }}</p>
              <hr v-if="item.description != null"/>
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

      <!-- <v-dialog v-model="openBingoClosed" width="90%">
        <v-card class="its-over">
          <v-card-text>
            <h2>Slut på Sommarbingo!</h2>
            <p>Sommaren är över, uteserveringarna har demonterats.</p>
            <p>Det blir såklart avslutningsfest på Pastan i november!</p>
            <p><router-link to="/toplist" @click="openBingoClosed=false">Här</router-link> kan du kika på resultaten så länge!</p>

          </v-card-text>
        </v-card>
      </v-dialog> -->
      <RouterView>
        
      </RouterView>
    </div>
    <footer>
        <p><em>© 2024 Kvilles Sommarbingo</em>. <a href="https://github.com/kikkipedia/KvilleSommarBingo/" target="_blank">Checkout the code</a> 
        <br/>Rapportera fel: <a href="sms:+46762100615">0762100615</a></p>
    </footer> 
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useBingoStore } from './stores';
import { watch, ref, onMounted } from 'vue';
import {getBingoItems } from './db'
import { type BingoItem } from './types';
import Statistics from './components/Statistics..vue';


const store = useBingoStore()
const name = ref('')

const openInfo = ref(false)
const openStats = ref(false)
const descriptions = ref<BingoItem[]>([]) //BingoItems from database
const componentKey = ref(0)
const openBingoClosed = ref(false)
const showButton = ref(false)

//get name from store
watch(() => store.name, (nam) => {
    name.value = nam
  
})

watch(() => store.isAuth, () => {
  componentKey.value++
})

watch (() => store.bingoId, () => {
  showButton.value = store.bingoId ? true : false
  componentKey.value++
})

const uid = localStorage.getItem('userId')


//watch for changes in bingoId

//sort by description.name in ascending order
const sortItems = (): BingoItem[] => {
  descriptions.value.sort((a, b) => a.item.localeCompare(b.item))
  return descriptions.value
}

onMounted(async () => {
  const items = await getBingoItems()
  descriptions.value = items
  sortItems()
  //check if uid
  if (localStorage.getItem('userId') == null) {
    store.isAuth = false
  } else {
    store.isAuth = true
  }
})


</script>

<style >
nav {
    justify-content: space-between;
    background-color: #7400FF;
    width: 100% !important;
    height: 60px;
    margin: auto;
    padding: 0.5rem;
    color: white;
}

nav li {
  padding-right: 0.5rem;
}

nav ul {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0;
  max-height: 50px;
}
.my-icon {
  color: white;             /* inactive */
}
.my-icon--active {
  color: hsla(160, 100%, 37%, 1) !important;/* whatever “other” color you like */
}
.v-card {
  overflow: hidden !important;
}

.mdi:before, .mdi-set {
    font-size: 2rem;

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

.map-container {
  width: 100%;
  height: 80%;
  margin: auto;
  padding: 0.5rem;
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

}

.main {
  background-color: white;
  margin-top: 10px;
  margin-bottom: 10px;
  min-height: calc(100vh - 180px) !important;
  text-align: center;
}

footer {
  text-align: center;
  bottom: 0;
  width: 100% !important;
  padding: 0.5rem;
  font-size: 0.8rem;
  color: white;
  background-color: #7400FF;
  height: 60px;
}

h4 {
  font-size: 0.8rem;
  font-weight: bold;
  color: #7400FF;
  padding-top: 5px
}

.v-icon {
  --v-icon-size-multiplier: 2;
}

h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #7400FF;
}

.its-over {
  background-color: #7400FF;
  color: white;
  border: 5px solid #00FF00;
}

.its-over a {
  font-size: large;
  font-weight: bold;
}

.its-over h2 {
  font-size: 2rem;
  font-weight: bold;
  color: white
}

footer {
  text-align: center;
  bottom: 0;
  width: 100% !important;
  padding: 0.5rem;
  font-size: 0.8rem;
  color: white;
  background-color: #7400FF;
  margin: auto;
  position: relative;
}
</style>
