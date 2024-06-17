<template>
    <div>
        <div class="buttons">
            <v-btn class="reset" size="x-small" color="#EB00D7" @click="resetWarning = true" v-if="bingoSheet" >Återställ</v-btn>
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
            <!-- If no userId in local storage. Log in or register -->
            <div class="auth-btns" v-if="!userId">
                <v-btn
                    color="#EB00D7"
                    @click="login"
                >
                Login
            </v-btn>
                <p>or</p>
                <v-btn 
                    color="#EB00D7"
                    @click="register"
                >
                Register
            </v-btn>
            </div>
            <!-- If userId in local storage -->
            <div v-else class="welcome"> 
                <h2>Välkommen {{ user }}</h2>
                <!-- if bingo id in local storage -->
                <p class="bingoId" v-if="bingoId && !store.bingo == true">Din brickas ID är: {{ bingoId }} <br/>(kan vara bra att spara!)</p>
            </div>

            <!-- here the sheet will render -->
        <Sheet :bingo-sheet="bingoSheet" :bingo-id="bingoId" v-if="showSheet"/>

        <!-- TODO -->
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

        <!-- Visible if showShuffle is true TODO not working -->
        <div class="btn-container" v-if="showShuffle == true">
            <v-btn
                color="#EB00D7"
                size="x-large"
                :loading="loading"
                @click="randomizeSheet"
                v-if="userId"
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
import { saveNewSheetToDb, getBingoItems, fetchSheetById, fetchUserByName } from '@/db';
import { useBingoStore } from '@/stores/index';
import Sheet from '@/components/Sheet.vue';
import router from '@/router';

interface Rules {
    required: (value: any) => boolean | string;
}

const rules: Rules = {
    required: (value) => !!value || 'Field is required',
};
const user = ref()
const loading = ref(false)
const showShuffle= ref(false) //get new bingo sheet - hidden when playing for non-cheating
const bingoSheet = ref<BingoSheet>()
const bingoId = ref() //id for bingoSheet, stored in localStorage
const userId = ref() //id for user, stored in localStorage
const showButton = ref(false) //show button to get new sheet
const showSheet = ref(false) //show sheet
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

const login = () => {
    router.push('/login')
}

const register = () => {
    router.push('/register')
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
    //saves to db
    saveNewSheet()
    showSheet.value = true
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
    localStorage.removeItem('userName')
    localStorage.removeItem('userId')
    bingoId.value = ''
    user.value = ''
    userId.value = ''
    showShuffle.value = false
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

const sheetCheck = () => {
    //check if exists in local storage
    if(localStorage.getItem('bingoId') != null){
        bingoId.value = localStorage.getItem('bingoId')
        const hasBingo = localStorage.getItem('bingo')
        //fetch sheet from db
        if(hasBingo == 'false' || hasBingo === null){
            showSheet.value = true
            fetchOldSheet()
        }
        else if(hasBingo == 'true'){ //if bingo is true show shuffle button
            showShuffle.value = true
            store.bingo = true
            showSheet.value = false
        }
    }
    else {
        showShuffle.value = true
    }
}

//TODO use with firebase auth
onMounted(async ()  => {
    //check localStorage for user info
    const userCheck = localStorage.getItem('userId')
    if (userCheck != null) {
        user.value = localStorage.getItem('userName')
        store.setName(user.value)
        //local storage has user id or else fetch it
        if(localStorage.getItem('userId') != null){
            userId.value = localStorage.getItem('userId')
            sheetCheck()
        }
        else {
            const userIdCheck = await fetchUserByName(user.value)
            //@ts-ignore
            userId.value = userIdCheck.id
            localStorage.setItem('userId', userId.value)
            sheetCheck()
        }
    }
    sheetCheck()
})


//if bingo - show shuffle button
watch(() => store.bingo, () => {
    if(bingoSheet && store.bingo){
        showShuffle.value = true
    }
})

watch(() => store.name, (name) => {
    user.value = name
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
    max-width: 80%;
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

.auth-btns {
    text-align: center;
    margin: 0 auto;
    margin-top: 1rem;
}

p {
    margin: 1rem;
}
</style>