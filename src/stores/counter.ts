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
  
  

  return { name, setName, srow1, srow2, srow3, srow4, srow5, srow6, srow7, srow8}
})