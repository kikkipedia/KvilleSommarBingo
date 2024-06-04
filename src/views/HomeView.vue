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
            <p class="bingoId" v-if="bingoId">Din brickas ID är: {{ bingoId }}</p> <!-- ev ta bort? Men bra om man vill återställa-->
        </div>
        <div class="bingoSheet" v-show="bingoId">
            <table>
                <tr>
                    <td v-for="doc, index in row1" :key="doc.id" @click="bingoClick(index, 1, doc.id)" :class="[doc.id]" id="unchecked">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row2" :key="doc.id" @click="bingoClick(index, 2, doc.id)" :class="[doc.id]" id="unchecked">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row3" :key="doc.id" @click="bingoClick(index, 3, doc.id)" :class="[doc.id]" id="unchecked">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row4" :key="doc.id" @click="bingoClick(index, 4, doc.id)" :class="[doc.id]" id="unchecked">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row5" :key="doc.id" @click="bingoClick(index, 5, doc.id)" :class="[doc.id]" id="unchecked">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row6" :key="doc.id" @click="bingoClick(index, 6, doc.id)" :class="[doc.id]" id="unchecked">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row7" :key="doc.id" @click="bingoClick(index, 7, doc.id)" :class="[doc.id]" id="unchecked">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row8" :key="doc.id" @click="bingoClick(index, 8, doc.id)" :class="[doc.id]" id="unchecked">{{ doc.item }}</td>
                </tr>
            </table>
            <div v-if="bingoSheet?.bingo" class="bingoYes">Bingo ! !</div>
        </div>
        <div class="btn-container" v-show="bingoId == ''">
            <button @click="randomizeSheet">Generera ny bricka</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { type BingoItem, type BingoSheet } from '@/types';
//@ts-ignore
import { saveNewSheetToDb, getBingoItems, updateSheetInDb, updateBingoItemCount, saveNewUser, updateUserScore, fetchUserByName } from '@/db';
import { useBingoStore } from '@/stores/counter';

const user = ref()
const showForm = ref(false) //visible if local storage is empty
const showShuffle= ref(true) //get new bingo sheet - hidden when playing for non-cheating
const bingoSheet = ref<BingoSheet>()
const bingoId = ref('') //id for bingoSheet, stored in localStorage
const userId = ref('') //id for user, stored in localStorage
const showButton = ref(true) //show button to get new sheet
const bingoItems = ref<BingoItem[]>([]) //BingoItems from database
const row1 = ref<BingoItem[]>([]) //rows for the bingo sheet
const row2 = ref<BingoItem[]>([])
const row3 = ref<BingoItem[]>([])
const row4 = ref<BingoItem[]>([])
const row5 = ref<BingoItem[]>([])
const row6 = ref<BingoItem[]>([])
const row7 = ref<BingoItem[]>([])
const row8 = ref<BingoItem[]>([])
//const row9 = ref<number[]>([]) //TODO: add more rows
//const row10 = ref<number[]>([])

const store = useBingoStore()

const setUser = async (event: Event) => {
    event.preventDefault()
    localStorage.setItem('user', user.value)
    showForm.value = false
    store.setName(user.value)
    userId.value = await saveNewUser(user.value)
    localStorage.setItem('userId', userId.value)
}

const randomizeSheet = async () => {
    //empty rows
    store.srow1 = []
    store.srow2 = []
    store.srow3 = []
    store.srow4 = []
    store.srow5 = []
    store.srow6 = []
    store.srow7 = []
    store.srow8 = []
    const items = await getBingoItems() //fetch drom database
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
    row6.value = bingoSheet.value?.items?.slice(25, 30) 
    row7.value = bingoSheet.value?.items?.slice(30, 35)
    row8.value = bingoSheet.value?.items?.slice(35, 40)
    // row9.value = testSheet.value.slice(40, 45) //we dont have 50 items yet
    // row10.value = testSheet.value.slice(45, 50)

    saveNewSheet()
}

//saves the sheet to the database
const saveNewSheet = async () => {
    bingoId.value = await saveNewSheetToDb(bingoSheet.value) 
    localStorage.setItem('bingoId', bingoId.value) //saves the id to local storage
}

//when clicking on a bingo sheet cell
const bingoClick = (index: number, row: number, id: string )=> {
    //check if already checked, then uncheck and remove from store row
    const checker1 = document.getElementsByClassName(id);
    const checker2 = checker1[0]?.getAttribute("id")
    if(checker2 == "checked"){
        checker1[0]?.setAttribute("style", "background-color:white; color: #6200ea; border: 2px solid #6200ea;");
        checker1[0]?.setAttribute("id", "unchecked");
        //TODO remove count from db
        if(row == 1){
            store.srow1.pop()
        }
        else if(row == 2){
            store.srow2.pop()
        }
        else if(row == 3){
            store.srow3.pop()
        }
        else if(row == 4){
            store.srow4.pop()
        }
        else if(row == 5){
            store.srow5.pop()
        }
        else if(row == 6){
            store.srow6.pop()
        }
        else if(row == 7){
            store.srow7.pop()
        }
        else if(row == 8){
            store.srow8.pop()
        }
        else {
            alert("Error. Kontakta Danne eller Kicki")
        }
    }
    else if (checker2 == "unchecked"){
        checker1[0]?.setAttribute("style", "background-color:#6200ea; color: white; border: 2px solid white;");
        checker1[0]?.setAttribute("id", "checked");
        updateBingoItemCount(id) //updates the item in the database
        //push index to store rows
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
        else if(row == 6){
            store.srow6.push(index)
        }
        else if(row == 7){
            store.srow7.push(index)
        }
        else if(row == 8){
            store.srow8.push(index)
        }
        else {
            alert("Error. Kontakta Danne eller Kicki")
        }
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

watch(() => bingoId.value, (bingoId) => {
    if(bingoId){
        showButton.value = false
    }
})

//watch for full row in store
watch(() => store.srow1.length, (srow1) => {
    if(store.srow1.length == 5){
        if(bingoSheet.value){
            bingoSheet.value.bingo = true
        }
    }
})
watch(() => store.srow2.length, (srow2) => {
    if(store.srow2.length == 5){
        if(bingoSheet.value){
            bingoSheet.value.bingo = true
        }
    }
})
watch(() => store.srow3.length, (srow3) => {
    if(store.srow3.length == 5){
        if(bingoSheet.value){
            bingoSheet.value.bingo = true
        }
    }
})
watch(() => store.srow4.length, (srow4) => {
    if(store.srow4.length == 5){
        if(bingoSheet.value){
            bingoSheet.value.bingo = true
        }
    }
})
watch(() => store.srow5.length, (srow5) => {
    if(store.srow5.length == 5){
        if(bingoSheet.value){
            bingoSheet.value.bingo = true
        }
    }
})
watch(() => store.srow6.length, (srow6) => {
    if(store.srow6.length == 5){
        if(bingoSheet.value){
            bingoSheet.value.bingo = true
        }
    }
})
watch(() => store.srow7.length, (srow7) => {
    if(store.srow7.length == 5){
        if(bingoSheet.value){
            bingoSheet.value.bingo = true
        }
    }
})
watch(() => store.srow8.length, (srow8) => {
    if(store.srow8.length == 5){
        if(bingoSheet.value){
            bingoSheet.value.bingo = true
        }
    }
})

//watch for bingo in bingoSheet
watch(() => bingoSheet.value?.bingo, async () => {
    if(bingoSheet.value?.bingo){
        updateSheetInDb(bingoSheet.value, bingoId.value)
        if(userId.value != ''){
            updateUserScore(userId.value)//userid
        }
        else {
            console.log("No user id")
            const user = await fetchUserByName(localStorage.getItem('user'))
            updateUserScore(user)
    }
}})

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
    border: 3px solid white;
    
}

td {
    font-size: 10px;
    color: #6200ea;
    background-color: white;
    border: 2px solid #6200ea;
    height: 70px;
    text-align: center;
    cursor: pointer;
    font-weight: bold;
}

.bingoYes {
    background-color: #6200ea;
    color: white;
    font-size: 2rem;
    text-align: center;
    padding: 1rem;
    border-radius: 20px;
    margin-top: 1rem;
}

.bingoId {
    font-size: 0.7rem;
    color: rgb(10, 150, 125);
}
</style>