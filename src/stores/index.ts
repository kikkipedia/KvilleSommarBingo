import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useBingoStore = defineStore('bingoStore', () => {
  const name = ref ('')

  function setName(newName: string) {
    name.value = newName
  }

 const bingo = ref(false)

  function setBingo(newBingo: boolean) {
    bingo.value = newBingo
  }


  return { name, setName, bingo, setBingo}
})