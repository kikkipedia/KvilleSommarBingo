<template>
      <nav>
        <ul>
            <li class="logo">Kvilles Sommarbingo <span class="symbol">(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧</span></li>
            <li><img src="./assets/info.svg"></li>
            <li><img src="./assets/statistics.svg"></li>
        </ul>
    </nav>
    <div class="main">
      <RouterView />
    </div>
    <footer>
        <p>© 2024 Kvilles Sommarbingo. Idé: Sikas. Kod: Kicki & Danne. GitHub repo</p>
    </footer>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useBingoStore } from './stores/counter';
import { watch, ref } from 'vue';

const store = useBingoStore()
const name = ref('')

//get name from store
watch(() => store.name, (nam) => {
    name.value = nam
})


</script>

<style scoped>
nav {
    display: flex;
    justify-content: space-between;
    background-color: white;
    width: 100% !important;
    color: #EB00D7;
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

li a:hover:not(.active) {
  background-color: #111;
}

.active {
  background-color: #04AA6D;
}

.main {
  padding: 20px;
  background-color: white;
  margin: 10px;
  height: 100% !important;
}

footer {
  text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 1rem;
    font-size: 0.8rem;
    color: #333;
    border-top: 1px solid #EB00D7;
    background-color: white;
    }

.symbol {
    font-size: 1rem;
    color: rgb(10, 150, 125);
    font-family: 'Courier New', Courier, monospace;
    text-align: middle;
}
</style>
