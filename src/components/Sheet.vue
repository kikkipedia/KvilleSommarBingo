<template>
    <div class="bingoSheet" v-show="bingoId">
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
            </table>
            <div v-if="bingoSheet?.bingo" class="bingoYes">Bingo ! !</div>
        </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { type BingoItem } from '@/types';
import { minusBingoItemCount, updateBingoItemCount, updateSheetInDb, updateUserScore } from '@/db';
import { useBingoStore } from '@/stores';

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

const checkedBox = ref(false)

//on Mounted check if Id is in local storage
onMounted(() => {
    if (props.bingoSheet) {
        setRows()
    }
    else return
})

watch(() => props.bingoSheet, () => {
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
    //todo add more rows
    }
}

const bingoClick = (index: number, row: number, id: string) => {
    if (props.bingoSheet) {
        const item = props.bingoSheet.items?.find((item: BingoItem) => item.id === id)
        //set the item to checked/not-checked
        item!.isChecked = !item!.isChecked
        if (item!.isChecked) {
            //update the item count
            console.log('checked', item!.item)
            const itemId = item!.id
            updateBingoItemCount(itemId)
        }
        //substract again
        else {
            console.log('unchecked', item!.item)
            minusBingoItemCount(item!.id)
        }
        
        //update the sheet in db
        console.log('updating sheet', props.bingoSheet, props.bingoId)
        updateSheetInDb(props.bingoSheet, props.bingoId)
        //check if bingo
        checkBingo()
    }
    else return
    }

const checkBingo = () => {
    if (props.bingoSheet) {
        const rows = [row1, row2, row3, row4, row5, row6, row7, row8]
        let bingo = false
        rows.forEach((row, index) => {
            if (row.value.every((item: BingoItem) => item.isChecked)) {
                bingo = true
                console.log('Bingo')
                localStorage.setItem('bingo', 'true')
                //save 
            }
        })
        props.bingoSheet.bingo = bingo
    }

}


//watch for bingo in bingoSheet
watch(() => props.bingoSheet?.bingo, () => {
    if (props.bingoSheet) {
        if (props.bingoSheet.bingo) {
            props.bingoSheet.bingo = true
            store.bingo = true
            //update user score
            updateUserScore(localStorage.getItem('userId') as string)
        }
        else {
            props.bingoSheet.bingo = false
        }
    }
})


</script>

<style scoped>

.bingoSheet {
    border: 3px solid #6200ea;
    border-radius: 20px;
    padding: 0.5rem;
    margin: 1rem 0;
    min-height: 500px;
    background-color: #6200ea;
}

table {
    width: 100%;
    
    
}

td {
    font-size: 10px;
    color: #6200ea;
    background-color:white;
    border: 2px solid #6200ea;
    height: 70px;
    text-align: center;
    cursor: pointer;
    font-weight: bold;
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

</style>