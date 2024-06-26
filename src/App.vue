<template>
      <nav>
        <ul v-if="store.isAuth">
            <li><v-icon large @click="openMap = true">mdi-map-legend</v-icon> </li>
            <li><v-icon large @click="openInfo = true">mdi-information-outline</v-icon></li>
            <li><v-icon large @click="openStats = true">mdi-chart-box-outline</v-icon></li>
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

      <v-dialog v-model="openMap" width="90%">
        <v-btn
            color="rgb(10, 150, 125)"
            icon="mdi-close"
            @click="openMap = false"
          ></v-btn>
        <v-card>
          <v-card-text>
            <div><Map/></div>
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


      <RouterView :key="$route.fullPath"/>
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
import Map from '@/components/Map.vue';

const store = useBingoStore()
const name = ref('')

const openInfo = ref(false)
const openStats = ref(false)
const openMap = ref(false)  
const descriptions = ref<BingoItem[]>([]) //BingoItems from database

//get name from store
watch(() => store.name, (nam) => {
    name.value = nam
})

//sort by description.name in ascending order
const sortItems = (): BingoItem[] => {
  descriptions.value.sort((a, b) => a.item.localeCompare(b.item))
  return descriptions.value
}

onMounted(async () => {
  const items = await getBingoItems()
  descriptions.value = items
  sortItems()
})

</script>

<style scoped>
nav {
    justify-content: space-between;
    background-color: #7400FF;
    width: 100% !important;
    color: white;
    height: 60px;
    margin: auto;
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

.logo {
  font-family: "Chakra Petch", sans-serif;
  font-weight: 900;
  font-size: 1.5rem;
  font-style: normal;
  cursor: pointer;
}

a {
  text-decoration: none;
  color: #00FF00;

}

.main {
  background-color: white;
  margin-top: 10px;
  margin-bottom: 10px;
  min-height: calc(100vh - 140px) !important;
}

footer {
  text-align: center;
  bottom: 0;
  height: 60px;
  width: 100% !important;
  padding: 0.5rem;
  font-size: 0.8rem;
  color: white;
  background-color: #7400FF;
  margin: auto;
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
</style>
