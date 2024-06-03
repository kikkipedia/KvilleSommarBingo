import { ref, watch } from 'vue'
import { defineStore } from 'pinia'


export const useBingoStore = defineStore('bingoStore', () => {
  const name = ref ('')

  function setName(newName: string) {
    name.value = newName
  }

  // thi is for watcher checking if the row is complete
  const srow1 = ref<number[]>([])
  const srow2 = ref<number[]>([])
  const srow3 = ref<number[]>([])
  const srow4 = ref<number[]>([])
  const srow5 = ref<number[]>([])

  watch(srow1, (newValue) => {
    if (newValue.length === 5) {
      console.log('row 1 complete')
    }
  })

  watch(srow2, (newValue) => {
    if (newValue.length === 5) {
      console.log('row 2 complete')
    }
  })

  watch(srow3, (newValue) => {
    if (newValue.length === 5) {
      console.log('row 3 complete')
    }
  })

  watch(srow4, (newValue) => {
    if (newValue.length === 5) {
      console.log('row 4 complete')
    }
  })

  watch(srow5, (newValue) => {
    if (newValue.length === 5) {
      console.log('row 5 complete')
    }
  })
  

  return { name, setName, srow1, srow2, srow3, srow4, srow5}
})