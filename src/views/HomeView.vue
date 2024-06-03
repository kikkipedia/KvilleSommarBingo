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
        </div>
        <div class="bingoSheet"><!-- will hide this later-->
            <table>
                <tr>
                    <td v-for="doc, index in row1" :key="doc.id" @click="bingoClick(index, 1)">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc in row2" :key="doc.id">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc in row3" :key="doc.id">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc in row4" :key="doc.id">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc in row5" :key="doc.id">{{ doc.item }}</td>
                </tr>
            </table>
        </div>
        <button @click="randomizeSheet">Generera ny bricka</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type BingoItem, type BingoSheet } from '@/types';
//@ts-ignore
import { saveNewSheetToDb, getBingoItems, setRows } from '@/db';
import { useBingoStore } from '@/stores/counter';
import { set } from 'firebase/database';

const user = ref()
const showForm = ref(false)
const bingoSheet = ref<BingoSheet>()
const bingoId = ref()
const testSheet = ref<any[]>([]) //numer as array
const bingoItems = ref<BingoItem[]>([]) //BingoItems from database
const row1 = ref<BingoItem[]>([]) //These should later BingoItems
const row2 = ref<BingoItem[]>([])
const row3 = ref<BingoItem[]>([])
const row4 = ref<BingoItem[]>([])
const row5 = ref<BingoItem[]>([])
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
}

const randomizeSheet = async () => {
    //Todo add fetch bingoItems from database
    const items = await getBingoItems()
    bingoItems.value = items

    const shuffledArray = bingoItems.value.sort(() => Math.random() - 0.5) //shuffles the array
    //add shuffeled array to bingoSheet.items
    const name = user.value
    const timeStarted = new Date().toLocaleString('sv-SE')
    const bingo = false
    const bingoSheet2 = {name, timeStarted, bingo, items: []}
    if(shuffledArray.length){
        for(var post in shuffledArray){
            //@ts-ignore
            //push all items to bingoSheet2
            bingoSheet2.items.push(shuffledArray[post])
        }
    }
    bingoSheet.value = bingoSheet2
    

    row1.value = bingoSheet.value?.items?.slice(0, 5) //slices the array into rows
    row2.value = bingoSheet.value?.items?.slice(5, 10)
    row3.value = bingoSheet.value?.items?.slice(10, 15)
    row4.value = bingoSheet.value?.items?.slice(15, 20)
    row5.value = bingoSheet.value?.items?.slice(20, 25)
    // row6.value = testSheet.value.slice(25, 30) //we dont have 50 items yet
    // row7.value = testSheet.value.slice(30, 35)
    // row8.value = testSheet.value.slice(35, 40)
    // row9.value = testSheet.value.slice(40, 45)
    // row10.value = testSheet.value.slice(45, 50)
}


const saveNewSheet = async () => {
    // const query = {
    //     name: user.value,
    //     bingoSheet: randomizeSheet(),
    //     timeStarted: new Date().toLocaleString('sv-SE'),
    //     bingo: false
    // }
    bingoId.value = await saveNewSheetToDb(bingoSheet.value) //saves the sheet to the database
    localStorage.setItem('bingoId', bingoId.value) //saves the id to local storage

}

const bingoClick = (index: number, row: number) => {
    //push index to checkedNumbers
    if(row == 1){
        store.srow1.push(index)
    }
    else if(row == 2){
        store.srow2.push(index)
    }
    else if(row == 3){
        store.srow3.push(index)
    }
    else if(row == 4){
        store.srow4.push(index)
    }
    else if(row == 5){
        store.srow5.push(index)
    }
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

//watch for empty row

</script>

<style scoped>

.bingoSheet {
    border: 3px solid #6200ea;
    border-radius: 20px;
    padding: 1rem;
    margin: 1rem 0;
    min-height: 500px;
    background-color: #6200ea;
}

table {
    width: 100%;
    border-collapse: collapse;
    border: 3px solid #6200ea;
    
}

td {
    font-size: 10px;
    color: #6200ea;
    background-color: white;
    border: 3px solid #6200ea;
    height: 70px;
    text-align: center;
    cursor: pointer;
    font-weight: bold;
}
</style>