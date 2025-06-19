<template>
    <nav v-if="store.isAuth">
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
            icon="mdi-close"
            @click="openStats = false"
          ></v-btn>
        <v-card>
          <v-card-text>
            <div><Statistics/></div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!--rules 2025-->

      <v-dialog v-model="openRules" width="90%">
        <v-card style="overflow-y: auto;">
          <v-card-text class="infotext">
            <h2>Nytt 2025</h2>
            <ul>
              <li>Du måste registrera dig på nytt!</li>
              <li>När du registrerar dig slumpas du in i ett lag. Röda eller vita laget! Tänk röda/vita rosen.</li>
              <li>Ibland när du kryssar sätts en flagga ner. Laget får då 1p! Denna flagga ska det andra laget ta - genom att kryssa samma sak inom en radie på 30m.</li>
              <li>Då får laget 1p.</li>
              <li>En flagga kan inte sättas utanför Kville!</li>
              <li>För att delta i Capture the flag måste du tillåta platsspårning i din webläsare</li>
              <li>Karta <v-icon small>mdi-map-legend</v-icon>  och teamsida <v-icon small>mdi-flag-checkered</v-icon> nås via ikonerna högst upp.</li>
            </ul>
          </v-card-text>
          <v-btn
            @click="openRules = false"
            color="#7400FF"
            class="ma-6"
          >OK</v-btn>
        </v-card>
      </v-dialog>
      <RouterView>
        
      </RouterView>
    </div>
    <footer>
        <p><em>© 2024 Kvilles Sommarbingo</em>, a <a href="https://trams.life" target="_blank">Trams AB</a> production.
        <br/><a href="https://github.com/kikkipedia/KvilleSommarBingo/" target="_blank">Checkout the code</a> / Rapportera fel: <a href="sms:+46762100615">0762100615</a></p>
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
const openRules = ref(false)

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
    //open info about this year's bingo
    openRules.value = true
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

.logoLiten {
  height: 50px;
  width: auto;
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
  color: white;   
}
.my-icon--active {
  color: hsla(160, 100%, 37%, 1) !important;
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
  width: 100%;
  border: 4px solid #7400FF;
  font-family:'Roboto Mono', monospace;
}
li {
  list-style: none;
  padding: 0.5rem;
  float: left;
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

.infotext li {
  font-size: 12px;
  padding: 3px;
}

@media (max-width: 340px) {
  nav {
    flex-direction: column;
  }

  .map-container {
    height: 60%;
  }

  footer {
    font-size: 0.7rem;
  }

  h2 {
    font-size: 18px;
  }

  .bingoInfo p{
    font-size: 0.8rem;
    margin: 2px;
  }
  .bingoId p{
    font-size: 0.5rem;
    margin: 2px;
  }
}
</style>
