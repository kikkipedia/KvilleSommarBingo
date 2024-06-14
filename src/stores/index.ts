import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useBingoStore = defineStore('bingoStore', () => {
  const name = ref ('')

  function setName(newName: string) {
    name.value = newName
  }

  // this is for watcher checking if the row is complete
  const srow1 = ref<number[]>([])
  const srow2 = ref<number[]>([])
  const srow3 = ref<number[]>([])
  const srow4 = ref<number[]>([])
  const srow5 = ref<number[]>([])
  const srow6 = ref<number[]>([])
  const srow7 = ref<number[]>([])
  const srow8 = ref<number[]>([])

  //this will save the rows and checked info as json in localStorage
  const saveSheet = (ids: any) => {
    const sheet = [ {srow1: srow1.value, ids: ids.slice(0, 5)}, {srow2: srow2.value, ids: ids.slice(5,10)}, {srow3: srow3.value, ids: ids.slice(10,15)}, {srow4: srow4.value, ids: ids.slice(15,20)}, {srow5: srow5.value, ids: ids.slice(20,25)}, {srow6: srow6.value, ids: ids.slice(25,30)}, {srow7: srow7.value, ids: ids.slice(30,35)}, {srow8: srow8.value, ids: ids.slice(40,45)} ]
    localStorage.setItem('localSheet', JSON.stringify(sheet))
  }
  
  //update local storage after each click
  const updateLocalSheet = () => {
    const sheet = JSON.parse(localStorage.getItem('localSheet') || '[]')
    sheet[0].srow1 = srow1.value
    sheet[1].srow2 = srow2.value
    sheet[2].srow3 = srow3.value
    sheet[3].srow4 = srow4.value
    sheet[4].srow5 = srow5.value
    sheet[5].srow6 = srow6.value
    sheet[6].srow7 = srow7.value
    sheet[7].srow8 = srow8.value

    localStorage.setItem('localSheet', JSON.stringify(sheet))
  }


  return { name, setName, srow1, srow2, srow3, srow4, srow5, srow6, srow7, srow8, saveSheet, updateLocalSheet}
})