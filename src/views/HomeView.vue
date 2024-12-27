<template>
    <div>
         <!-- Warning before reset -->
                <v-dialog  v-model="resetWarning" width="90%">
                    <v-card
                        prepend-icon="mdi-alert"
                        text="By resetting you will lose all progress and have to start over, and there is no way back. Are you sure?"
                        title="Warning!"
                    >
                        <v-card-actions>
                            <v-btn color="#EB00D7" @click="resetWarning = false">Cancel</v-btn>
                            <v-btn color="#EB00D7" @click="resetWarning = false; reset()">Reset</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            <!-- If userId in local storage -->
           <!--  <div v-if="userId" class="welcome"> 
                <h2 v-if="showSheet == false">Välkommen {{ user }}</h2> -->
                <!-- if bingo id in local storage -->
                
                <!-- <div style="text-align: left;">
                    <p class="bingoInfo" v-if="showSheet == true">Vid Bingo ring personsökaren <b>0740119540 </b> och lämna telefonnummer och vänta på att bli uppringd av vår vinsttelefon</p>
                </div> 
            </div> -->

            <img src="@/assets/NB_LOGO.png" alt="logo" id="logo"/>
            <p class="bingoId" v-if="bingoId && !store.bingo == true">Din brickas ID är: {{ bingoId }} (kan vara bra att spara!)</p>
        <!-- Visible if showShuffle is true -->
        <div class="btn-container" v-if="!showSheet && showShuffle">
            <v-btn
                color="#00FF00"
                size="large"
                :loading="loading"
                @click="randomizeSheet"
                
            >
                Generera bricka!
                <template v-slot:loader>
                    <v-progress-linear indeterminate></v-progress-linear>
                </template>
            </v-btn>
        </div>

            <!-- here the sheet will render -->
        <Sheet :bingo-sheet="bingoSheet" :bingo-id="bingoId" v-show="showSheet"/>

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

         <div class="buttons">
            <v-btn class="fetchOld"  @click="fetchByIdWarning = true" size="x-small" color="#7400FF" v-if="!showSheet">Hämta tidigare bricka</v-btn>
            <v-btn color="#00FF00" v-else>Ny bricka</v-btn>
            </div>
        <!--<br/>
            <v-btn class="reset" size="x-small" color="#7400FF" @click="resetWarning = true" v-if="user" >Återställ</v-btn>
        </div> -->
    </div>
<!--     <footer>
        <p><em>© 2024 Kvilles Sommarbingo</em>. <a href="https://github.com/kikkipedia/KvilleSommarBingo/" target="_blank">Checkout the code</a></p> 
        <p>Idé av Sikas, Björn och Rea. Kod av Kicki. Design av Danne. <br/>Rapportera fel: <a href="sms:+46762100615">0762100615</a></p>
    </footer>  -->
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import { type BingoItem, type BingoSheet } from '@/types';
import { saveNewSheetToDb, getBingoItems, fetchSheetById, fetchUserByName } from '@/db';
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
const showShuffle= ref(true) //get new bingo sheet - hidden when playing for non-cheating
const bingoSheet = ref<BingoSheet>()
const bingoId = ref() //id for bingoSheet, stored in localStorage
const userId = ref() //id for user, stored in localStorage
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
const row9 = ref<BingoItem[]>([])
const row10 = ref<BingoItem[]>([])

const store = useBingoStore()

const componentKey = ref(0)

const randomizeSheet = async () => {
    showShuffle.value = false
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
    const name = 'nyårbingo'
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
    store.setBingoId(bingoId.value)
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
    componentKey.value ++
    location.reload()
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
        row9.value = bingoSheet.value?.items?.slice(40, 45)
        row10.value = bingoSheet.value?.items?.slice(45, 50)
        showSheet.value = true
        store.setBingoId(bingoId.value)
    }
    else fetchByIdWarning.value = true
}

const fetchById = async () => {
    //fetch sheet from db from user input
    bingoSheet.value = await fetchSheetById(bingoId.value) as BingoSheet
    if(bingoSheet. value = undefined){
        localStorage.removeItem('bingoId')
        localStorage.removeItem('userName')
    }
    fetchByIdWarning.value = false
    localStorage.setItem('bingoId', bingoId.value)
    showSheet.value = true
    location.reload()
}

const sheetCheck = () => {
    //check if exists in local storage
    if(localStorage.getItem('bingoId') != null){
        bingoId.value = localStorage.getItem('bingoId')
        const hasBingo = localStorage.getItem('bingo')
        //fetch sheet from db
        if(hasBingo == 'false' || hasBingo === null){
            //showSheet.value = true
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

onMounted(async ()  => {
    //check localStorage for user info
    // const userCheck = localStorage.getItem('userId')
    // if (userCheck != null) {
    //     store.setAuth(userCheck)
    //     user.value = localStorage.getItem('userName')
    //     if(user.value){
    //         store.setName(user.value)
    //     }
    //     //local storage has user id or else fetch it
    //     if(localStorage.getItem('userId') != null){
    //         userId.value = localStorage.getItem('userId')
    //         sheetCheck()
    //     }
    //     else {
    //         const userIdCheck = await fetchUserByName(user.value)
    //         if(!userIdCheck ){
    //             reset()
    //         }
    //         //@ts-ignore
    //         store.setAuth(userIdCheck)
    //         //@ts-ignore
    //         userId.value = userIdCheck.id
    //         localStorage.setItem('userId', userId.value)
    //         sheetCheck()
    //     }
    // }
    sheetCheck()
    componentKey.value ++
})

//if bingo - show shuffle button
watch(() => store.bingo, () => {
    if(bingoSheet && store.bingo){
        showShuffle.value = true

    }
})

watch(() => store.name, (name) => {
    user.value = name
    componentKey.value ++
})

watch(() => showSheet.value, () => {
    if (showSheet.value == true) {
        //make logo smaller
        document.getElementById('logo')!.style.width = '40%'
    }
})

</script>

<style scoped>

#logo {
    width: 80%
}

.bingoId {
    font-size: 0.7rem;
    color: rgb(10, 150, 125);
}

.bingoInfo {
    font-size: 0.8rem;
    color: "#7400FF";
}   

.btn-container {
    display: block;
    text-align: center;
    padding-top: 20px;
    padding-bottom: 10px;
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
    margin-top: 0.1rem;
    margin-bottom: 2rem;
}

.buttons {
    display: block;
    text-align: center;
    margin-top: 6rem;
}

.auth-btns {
    display: block;
    text-align: center;
    margin-top: 1rem;
}

p {
    margin: 1rem;
}

.bingologo {
    display: block;
    margin: 0 auto;
    width: 100px;
}
.fetchOld {

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
}
</style>