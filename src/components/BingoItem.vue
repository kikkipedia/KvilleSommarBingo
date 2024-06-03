<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';


const props = defineProps<{
    id: String, // id from HomweView BingoItem
    checkedNumbers: Array<number>
}>()

const checked = ref(false)
//fetch bingoItem from db and add class checked if checked

//if checked, add class checked
watch(() => checked.value, (checked) => {
    if (checked) {
        //add class checked
    } else {
        //remove class checked
    }
})

</script>