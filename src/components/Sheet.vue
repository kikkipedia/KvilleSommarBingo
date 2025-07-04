// @ts-nocheck
<template>
    <div class="bingoSheet" >
        <ConfettiExplosion v-if="confetti" :particleSize="10" :duration="1500" :colors="colors"/>
        <div v-if="!props.bingoSheet">
          <p>Could not load your bingo sheet. Please try refreshing or contact support.</p>
        </div>
             <table>
                <tr>
                    <td v-for="doc, index in row1" :key="doc.id" @click="bingoClick(index, 1, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row2" :key="doc.id" @click="bingoClick(index, 2, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row3" :key="doc.id" @click="bingoClick(index, 3, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row4" :key="doc.id" @click="bingoClick(index, 4, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row5" :key="doc.id" @click="bingoClick(index, 5, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row6" :key="doc.id" @click="bingoClick(index, 6, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row7" :key="doc.id" @click="bingoClick(index, 7, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row8" :key="doc.id" @click="bingoClick(index, 8, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row9" :key="doc.id" @click="bingoClick(index, 9, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row10" :key="doc.id" @click="bingoClick(index, 10, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
            </table>
            <!-- Bingo Popup -->
            <v-overlay v-model="overlay" class="overlay">
                <ConfettiExplosion v-if="explode" :particleSize="15" :duration="2000" :colors="colors" :particleCount="200"/>
                <v-card
                    class="mx-auto my-8 bingocard"
                    elevation="16"
                >
                <!-- <span class="animate__animated animate__bounceIn">BINGO!</span> -->
                <span class="animate__animated animate__bounceIn"><img src="@/assets/bingogif.gif" alt="Bingo" /></span>
                </v-card>
            </v-overlay>
            <!--popup card if flag is taken -->
            <v-overlay v-model="flagPopup" class="flag-catch-overlay" persistent scrim="transparent">
                <v-card
                    elevation="10"
                >
                <div class="flag-catch-animation">
                    🏁<br />
                    <span class="message">FLAGGA TAGEN!</span>
                    <v-btn @click="flagPopup = false">
                    Yay!
                </v-btn>
                </div>
                
                </v-card>
            </v-overlay>
            <!-- popup if flag is put down-->
            <v-overlay v-model="setFlag" class="flag-catch-overlay" persistent scrim="transparent">
                <v-card
                    elevation="16"
                >
                <div class="flag-catch-animation">
                    🏁<br />
                    <span class="message">FLAGGA SATT!</span>
                    <v-btn @click="setFlag = false">
                    Yay!
                </v-btn>
                </div>
                </v-card>
            </v-overlay>
        </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { type BingoItem, type Flag } from '@/types';
import { minusBingoItemCount, updateBingoItemCount, updateSheetInDb, updateUserScore, saveLocation, getTeamFlags, deleteFlag } from '@/db';
import { useBingoStore } from '@/stores';
import ConfettiExplosion from "vue-confetti-explosion";
import 'animate.css';
import L from 'leaflet';

//define props
const props = defineProps({
    bingoId: String,
    bingoSheet: Object
})

const store = useBingoStore()

//local rows
const row1 = ref<BingoItem[]>([])
const row2 = ref<BingoItem[]>([])
const row3 = ref<BingoItem[]>([])
const row4 = ref<BingoItem[]>([])
const row5 = ref<BingoItem[]>([])
const row6 = ref<BingoItem[]>([])
const row7 = ref<BingoItem[]>([])
const row8 = ref<BingoItem[]>([])
const row9 = ref<BingoItem[]>([])
const row10 = ref<BingoItem[]>([])

const confetti = ref(false)
const explode = ref(false)
const colors = ['#6200ea', '#03a9f4', '#4caf50', '#ffeb3b', '#ff5722', '#795548', '#9c27b0', '#e91e63', '#00bcd4', '#009688', '#8bc34a', '#cddc39', '#ff9800', '#ff5722', '#607d8b']

const overlay = ref(false)
const flagPopup = ref(false)
const setFlag = ref(false)

//on Mounted check if Id is in local storage
onMounted(() => {
    if (props.bingoSheet) {
        setRows()
    }
    else return
})

watch(() => props.bingoSheet, (newVal) => {
  //console.log("bingoSheet updated:", newVal);
  setRows()
})

const setRows = () => {
    if(!props.bingoSheet) return
    else {
    row1.value = props.bingoSheet.items?.slice(0, 5) //slices the array into rows
    row2.value = props.bingoSheet.items?.slice(5, 10)
    row3.value = props.bingoSheet.items?.slice(10, 15)
    row4.value = props.bingoSheet.items?.slice(15, 20)
    row5.value = props.bingoSheet.items?.slice(20, 25)
    row6.value = props.bingoSheet.items?.slice(25, 30) 
    row7.value = props.bingoSheet.items?.slice(30, 35)
    row8.value = props.bingoSheet.items?.slice(35, 40)
    row9.value = props.bingoSheet.items?.slice(40, 45)
    row10.value = props.bingoSheet.items?.slice(45, 50)
    
    }
}

const bingoClick = async (index: number, row: number, id: string) => {
    //location.reload()
    if (props.bingoSheet) {
        const item = props.bingoSheet.items?.find((item: BingoItem) => item.id === id)
        //set the item to checked/not-checked
        item!.isChecked = !item!.isChecked
        if (item!.isChecked) {
            confetti.value = true
            //update the item count
            const itemId = item!.id
            updateBingoItemCount(itemId)
            setTimeout(() => {
                confetti.value = false
            }, 2000)
            //update the sheet in db
            updateSheetInDb(props.bingoSheet, props.bingoId)
            //check if bingo
            checkBingo(itemId)   
        }
        //substract again
        else {
            minusBingoItemCount(item!.id)
            //update the sheet in db
            updateSheetInDb(props.bingoSheet, props.bingoId)
        }
        
    }
    else return
    }

const checkBingo = (itemId: string) => {
    if (props.bingoSheet) {
        const rows = [row1, row2, row3, row4, row5, row6, row7, row8, row9, row10]
        let bingo = false
        for (const row of rows) {
            if (row.value.every((item: BingoItem) => item.isChecked)) {
                bingo = true
                break
            }
        }

        if (bingo && !store.bingo) {
            explode.value = true
            overlay.value = true
            localStorage.setItem('bingo', 'true')
            store.setBingo(true)

            const userId = localStorage.getItem('userId')
            if (userId) {
                updateUserScore(userId)
            }
        }

        props.bingoSheet.bingo = bingo
        updateSheetInDb(props.bingoSheet, props.bingoId)

        if (!bingo) {
            randomSave(itemId)
        }
    }
}
const getUserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      alert('Din webbläsare stöder inte geolocation.');
      return reject('Geolocation not supported.');
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        switch (error.code) {
          case 1:
            alert("Platsåtkomst nekades. Tillåt plats i webbläsaren.");
            break;
          case 2:
            alert("Kunde inte bestämma plats. Kontrollera att Wi-Fi är aktiverat och plats­tjänster är på");
            break;
          case 3:
            alert("Platsförfrågan tog för lång tid. Försök igen.");
            break;
          default:
            alert("Okänt fel vid hämtning av plats.");
        }
        console.error("Geolocation error:", error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

const handleExistingFlag = async (flag: Flag, lat: number, long: number, id: string) => {

  if (flag.team === store.team) {
    console.log("Already owned flag. No action needed.");
    return;
  }

  const userLatLng = L.latLng(lat, long);
  const markerLatLng = L.latLng(
    flag.location.latitude || flag.location._lat,
    flag.location.longitude || flag.location._long
  );

  const distance = userLatLng.distanceTo(markerLatLng);
  console.log('Distance to flag:', distance);

  if (distance <= 30) {
    console.log(`${flag.item} captured!`);
    flagPopup.value = true;
    await deleteFlag(id);
  } else {
    console.log("Too far from flag. Distance:", distance);
    flagPopup.value = false;
  }
};

const trySetRandomFlag = (id: string, lat: number, long: number) => {
  const random = Math.floor(Math.random() * 20) + 1;
  console.log('Random roll:', random);

  if (random === 1) {
    const withinBounds = checkBorders(lat, long);
    //console.log("Within allowed area:", withinBounds);

    if (!withinBounds) return;
    else {
      saveLocation(id, store.team, lat, long);
      setFlag.value = true;
      setTimeout(() => setFlag.value = false, 5000);
      //console.log("New flag set at", lat, long);
    }    
  }
  else return
};

const randomSave = async (id: string) => {
  try {
    const position = await getUserLocation();
    if(position){
      const lat = position.coords.latitude;
      const long = position.coords.longitude;

      console.log("User location:", lat, long);

      const response = await getTeamFlags(store.team);
      const flag = response.find(item => item.item === id);

      if (flag) {
        await handleExistingFlag(flag, lat, long, id);
      } else {
        trySetRandomFlag(id, lat, long);
      }
    }
    if (!position) {
      console.warn("Could not retrieve location. Maybe user denied permission.");
      return;
    }

  } catch (error) {
    console.error("Error in randomSave:", error);
  }
};


const checkBorders = (lat: number, long: number) => {
    
    //get extent from geojson
    const KVILLE_BOUNDS = {
        minLat: 57.713840934733405,
        maxLat: 57.72011020026795,
        minLng: 11.943897873882559,
        maxLng: 11.953817312223217,
    };
    //check if lat/long is within borders of Kville
    const withinLat = lat >= KVILLE_BOUNDS.minLat && lat <= KVILLE_BOUNDS.maxLat;
    const withinLng = long >= KVILLE_BOUNDS.minLng && long <= KVILLE_BOUNDS.maxLng;

    if(!withinLat || !withinLng) {
        console.log("Coordinates are outside the allowed area.");
        return false;
    }
    else
    return true;
    
}


//watch for bingo in bingoSheet
watch(() => props.bingoSheet, (sheet) => {
    if (!sheet || !sheet.items || sheet.items.length < 50) return;

    // re-check if there really is bingo
    const rows = [
        sheet.items.slice(0, 5),
        sheet.items.slice(5, 10),
        sheet.items.slice(10, 15),
        sheet.items.slice(15, 20),
        sheet.items.slice(20, 25),
        sheet.items.slice(25, 30),
        sheet.items.slice(30, 35),
        sheet.items.slice(35, 40),
        sheet.items.slice(40, 45),
        sheet.items.slice(45, 50),
    ];

    const isActuallyBingo = rows.some(row => row.every((item: BingoItem) => item.isChecked));

    if (isActuallyBingo && !store.bingo) {
        localStorage.setItem('bingo', 'true');
        store.setBingo(true);
        updateUserScore(localStorage.getItem('userId') as string);
    } else if (!isActuallyBingo) {
        store.setBingo(false);
        localStorage.setItem('bingo', 'false');
    }
});

</script>

<style scoped>

.bingoSheet {
    border: 1px solid #6200ea;
    border-radius: 10px;
    padding: 0.3rem;
    margin: 1rem 0;
    min-height: 500px;
    
}

table {
    width: 100%;   
    border-spacing: 0px;
}

td {
    font-size: 8px;
    color: #6200ea;
    background-color:white;
    border: 2px solid #6200ea;
    height: 70px;
    text-align: center;
    cursor: pointer;
    font-weight: bold;
    max-width: 75px;
}

.checked {
    background-color: #6200ea;
    color: white;
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

.bingocard {
    height: 300px;
    width: 300px;
}

.overlay {
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.flag-catch-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.flag-catch-animation {
width: 300px;
    height: 300px;
  font-size: 48px;
  text-align: center;
    border: 5px solid #00FF00;
    padding: 10px;
  text-shadow: 0 0 10px #51514c;
}

.flag-catch-animation .message {
  display: block;
  font-size: 24px;
  margin-top: 8px;
  font-weight: bold;
  animation: pulseText 1s infinite;
  
}

@keyframes popIn {
  0% {
    transform: scale(0.2);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes pulseText {
  0%, 100% {
    transform: scale(1);
    color: #6200ea;
  }
  50% {
    transform: scale(1.2);
    color: white;
  }
}

</style>