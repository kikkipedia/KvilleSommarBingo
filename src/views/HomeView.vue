<template>
    <div>
        <div v-if="showForm"> <!-- Register name if not in local storage-->
            <form @submit="setUser">
                <label for="user">Ange ditt namn:</label>
                <input type="text" id="user" v-model="user">
                <button type="submit">Spara</button>
            </form>
        </div>
        <div v-else>
            <h2>Välkommen {{ user }}</h2>
            <p><span class="symbol">(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧</span></p>
        </div>
        <div class="bingoSheet" v-if="bingoId">
            {{ row1 }} <br/>
            {{ row2 }} <br/>
            {{ row3 }} <br/>
            {{ row4 }} <br/>
            {{ row5 }} <br/>
            {{ row6 }} <br/>
            {{ row7 }} <br/>
            {{ row8 }} <br/>
            {{ row9 }} <br/>
            {{ row10 }} <br/>
        </div>
        <button @click="getNewSheet">Generera ny bricka</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { BingoSheet } from '@/types';
//@ts-ignore
import { saveNewSheet } from '@/db';
import { useBingoStore } from '@/stores/counter';

const user = ref()
const showForm = ref(false)
const bingoSheet = ref<BingoSheet>()
const bingoId = ref()
const testSheet = ref<number[]>([]) //numer as array
const row1 = ref<number[]>([]) //These should later BingoItems
const row2 = ref<number[]>([])
const row3 = ref<number[]>([])
const row4 = ref<number[]>([])
const row5 = ref<number[]>([])
const row6 = ref<number[]>([])
const row7 = ref<number[]>([])
const row8 = ref<number[]>([])
const row9 = ref<number[]>([])
const row10 = ref<number[]>([])
const checkedNumbers = ref<number[]>([]) //numbers checked by user

const store = useBingoStore()

const setUser = (event: Event) => {
    event.preventDefault()
    localStorage.setItem('user', user.value)
    showForm.value = false
    store.setName(user.value)
    //getNewSheet() //right now only generates on button click
}

const randomizeSheet = () => {
    //Todo add fetch bingoItems from database
    const sheetArray = Array.from({ length: 50 }, (_, i) => i + 1) //creates an array from 1 to 50
    const shuffledArray = sheetArray.sort(() => Math.random() - 0.5) //shuffles the array
    testSheet.value = shuffledArray
    row1.value = testSheet.value.slice(0, 5) //slices the array into rows
    row2.value = testSheet.value.slice(5, 10)
    row3.value = testSheet.value.slice(10, 15)
    row4.value = testSheet.value.slice(15, 20)
    row5.value = testSheet.value.slice(20, 25)
    row6.value = testSheet.value.slice(25, 30)
    row7.value = testSheet.value.slice(30, 35)
    row8.value = testSheet.value.slice(35, 40)
    row9.value = testSheet.value.slice(40, 45)
    row10.value = testSheet.value.slice(45, 50)
    return shuffledArray
}

const getNewSheet = async () => {
    const query = {
        name: user.value,
        bingoSheet: randomizeSheet(), //TODO: implement randomizeSheet from BingoItems as json
        timeStarted: new Date().toLocaleString('sv-SE'),
        bingo: false
    }
    bingoId.value = await saveNewSheet(query) //saves the sheet to the database
    localStorage.setItem('bingoId', bingoId.value) //saves the id to local storage

}

onMounted(() => {
    //check localStorage for user info
    if (localStorage.getItem('user')) {
        user.value = localStorage.getItem('user')
        store.setName(user.value)
    }
    else {
        showForm.value = true
    }
})

</script>

<style scoped>
.symbol {
    font-size: 1.5rem;
    color: #c71887;
    font-family: 'Courier New', Courier, monospace;
    text-align: top;
}

.bingoSheet {
    border: 2px solid #4054ef;
    border-radius: 20px;
    padding: 1rem;
    margin: 1rem 0;
    min-height: 500px;
}

</style>