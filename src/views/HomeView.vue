<template>
    <div>
        <div class="buttons">
            <v-btn class="reset" size="x-small" color="#EB00D7" @click="resetWarning = true" v-if="userId != ''" >Återställ</v-btn>
            <v-btn class="fetchOld" v-if="user" @click="fetchOldSheet" size="x-small">Hämta tidigare bricka</v-btn>
        </div>
            <div v-if="resetWarning">
                <v-card
                    prepend-icon="mdi-alert"
                    text="By resetting you will lose all progress and have to start over, and there is no way back. Are you sure?"
                    title="Warning! Are you sure you want to reset?"
                >
                    <v-card-actions>
                        <v-btn color="#EB00D7" @click="resetWarning = false">Cancel</v-btn>
                        <v-btn color="#EB00D7" @click="resetWarning = false; reset()">Reset</v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        <div v-if="showForm" class="form"> <!-- Register name if not already in local storage-->
            <v-form @submit.prevent>
                <v-text-field
                    :rules="[rules.required]"
                    v-model="user"
                    label="Namn"
                ></v-text-field>
                <v-btn :disabled="!user" color="#EB00D7" class="mt-2" type="submit" block @click="setUser">Registrera</v-btn>
                </v-form>
        </div>
        <div v-else class="welcome"> 
            <h2>Välkommen {{ user }}</h2>
            <p class="bingoId" v-if="bingoId">Din brickas ID är: {{ bingoId }} <br/>(kan vara bra att spara!)</p>
        </div>

        <Sheet :bingo-sheet="bingoSheet" :bingo-id="bingoId"/>

        <v-dialog v-model="fetchByIdWarning" width="90%">
            <v-btn
            size="small"
            icon="mdi-close"
            color="rgb(10, 150, 125)"
            @click="fetchByIdWarning = false"/>
            <v-card text="Om du har kvar ditt ID, ange det nedan.">
                <v-form @submit.prevent>
                    <v-text-field
                        v-model="bingoId"
                        label="Brickans ID"
                    ></v-text-field>
                    <v-btn :disabled="!bingoId" color="#EB00D7" class="mt-2" type="submit" block @click="fetchById">
                        Hämta
                        <template v-slot:loader>
                            <v-progress-linear indeterminate></v-progress-linear>
                        </template>
                    </v-btn>
                </v-form>
            </v-card>
        </v-dialog>
        <div class="btn-container" v-show="showShuffle == true">
            <p v-show="!bingoId">Image here??</p>
            <br/>
            <v-btn
                color="#EB00D7"
                size="x-large"
                :loading="loading"
                @click="randomizeSheet"
            >
                Generera bricka!
                <template v-slot:loader>
                    <v-progress-linear indeterminate></v-progress-linear>
                </template>
            </v-btn>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { type BingoItem, type BingoSheet } from '@/types';
//@ts-ignore
import { saveNewSheetToDb, getBingoItems, saveNewUser, fetchSheetById, fetchUserByName } from '@/db';
import { useBingoStore } from '@/stores/index';
import Sheet from '@/components/Sheet.vue';

interface Rules {
    required: (value: any) => boolean | string;
}

const rules: Rules = {
    required: (value) => !!value || 'Field is required',
};
const user = ref()
const loading = ref(false)
const showForm = ref(false) //visible if local storage is empty
const showShuffle= ref(true) //get new bingo sheet - hidden when playing for non-cheating
const bingoSheet = ref<BingoSheet>()
const bingoId = ref() //id for bingoSheet, stored in localStorage
const userId = ref() //id for user, stored in localStorage
const showButton = ref(true) //show button to get new sheet
const bingoItems = ref<BingoItem[]>([]) //BingoItems from database
const resetWarning = ref(false) //show warning before reset
const fetchByIdWarning = ref(false) //show warning before fetching by id
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

//this set user from form input
const setUser = async (event: Event) => {
    event.preventDefault()
    //check if user already exists
    const userExists = await fetchUserByName(user.value)
    if(userExists !== null){
        //@ts-ignore
        userId.value = userExists.id
        //@ts-ignore
        user.value = userExists.name
        localStorage.setItem('userId', userId.value)
        localStorage.setItem('user', user.value)
        store.setName(localStorage.getItem('user') as string)
    }
    else {
        userId.value = await saveNewUser(user.value)
        localStorage.setItem('userId', userId.value)
        localStorage.setItem('user', user.value)
        //@ts-ignore
        store.setName(user.value)
    }
    showForm.value = false
    showShuffle.value = true
}

const randomizeSheet = async () => {
  //empty local storage bingoId
    localStorage.removeItem('bingoId')
    localStorage.removeItem('bingo')
    loading.value = true
    bingoSheet.value = undefined

    const items = await getBingoItems() //fetch from database
    bingoItems.value = items
    //add field checked to all items
    for (let i = 0; i < bingoItems.value.length; i++) {
        bingoItems.value[i].isChecked = false
    }

    const shuffledArray = bingoItems.value.sort(() => Math.random() - 0.5) //shuffles the array
    //add shuffeled array to bingoSheet.items
    const name = user.value
    const timeStarted = new Date().toLocaleString('sv-SE')
    const bingo = false
    const bingoSheet2 = {name, timeStarted, bingo, items: [], rows: []  }
    if(shuffledArray.length){
        for(var post in shuffledArray){
            //@ts-ignore
            //push all items to bingoSheet2
            bingoSheet2.items.push(shuffledArray[post])
        }
    }
    bingoSheet.value = bingoSheet2
    saveNewSheet()
}

//saves the sheet to the database
const saveNewSheet = async () => {
    bingoId.value = await saveNewSheetToDb(bingoSheet.value) 
    localStorage.setItem('bingoId', bingoId.value) //saves the id to local storage
    loading.value = false
    showShuffle.value = false
}

const reset = () => {
    //add warning before reset
    localStorage.removeItem('bingoId')
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    bingoId.value = ''
    user.value = ''
    userId.value = ''
    showForm.value = true
    showShuffle.value = false
    showButton.value = true  
}

const fetchOldSheet = async () => {
    const localId = localStorage.getItem('bingoId')
    if(localId != null){
        //fetch sheet from db
        bingoId.value = localStorage.getItem('bingoId')
        bingoSheet.value = await fetchSheetById(bingoId.value) as BingoSheet
        //set rows as before
        row1.value = bingoSheet.value?.items?.slice(0, 5)
        row2.value = bingoSheet.value?.items?.slice(5, 10)
        row3.value = bingoSheet.value?.items?.slice(10, 15)
        row4.value = bingoSheet.value?.items?.slice(15, 20)
        row5.value = bingoSheet.value?.items?.slice(20, 25)
        row6.value = bingoSheet.value?.items?.slice(25, 30)
        row7.value = bingoSheet.value?.items?.slice(30, 35)
        row8.value = bingoSheet.value?.items?.slice(35, 40)
    }
    else fetchByIdWarning.value = true
}

const fetchById = async () => {
    //fetch sheet from db from user input
    bingoSheet.value = await fetchSheetById(bingoId.value) as BingoSheet
    fetchByIdWarning.value = false
}

onMounted(async ()  => {
    //check localStorage for user info
    const userCheck = localStorage.getItem('user')
    if (userCheck != null) {
        user.value = localStorage.getItem('user')
        //fetch user id 
        const userIdCheck = await fetchUserByName(user.value)
        //@ts-ignore
        userId.value = userIdCheck.id
        localStorage.setItem('userId', userId.value)
        let bingo = localStorage.getItem('bingo')
        const bingoo = localStorage.getItem('bingoId')
        showShuffle.value = false
        store.setName(user.value)
        if(bingo === null && bingoo != null) {
            fetchOldSheet()
            showShuffle.value = false
        }
        else if (bingo === 'true') {
            showShuffle.value = true
        }
    }
    else {
        showForm.value = true
    }
})

watch(() => bingoId.value, (bingoId) => {
    if(bingoId){
        showButton.value = false
        showShuffle.value = false
    }
})

//if bingo - show shuffle button
watch(() => store.bingo, () => {
    if(bingoSheet && store.bingo){
        showShuffle.value = true
    }
})
</script>

<style scoped>

.bingoId {
    font-size: 0.7rem;
    color: rgb(10, 150, 125);
}

.btn-container {
    display: block;
    text-align: center;
    margin-top: 1rem;
}

.welcome {
    text-align: center;
    margin-top: 1rem;
}

.form {
    padding-top: 1rem;
    text-align: center;
    max-width: 50%;
    margin: 0 auto;
}

.reset {
    text-align: right;
    margin-top: 1rem;
}

.buttons {
    display: flex;
    justify-content: space-between;
}

.fetchOld {
    text-align: left;
    margin-top: 1rem;
}
</style>