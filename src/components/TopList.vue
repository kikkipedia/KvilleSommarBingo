<template>
    <div class="list">
        <h2>Topplista kryss</h2>
        <div v-for="item in items" :key="item.id">
            <p>{{ item.item }}: {{ item.count }}</p>
        </div>
        <h2>Topplista poäng</h2>
        <div v-for="score in scores" :key="score.id">
            <p>{{ score.name }}: {{ score.score }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBingoItems, getAllUsers } from '@/db'

const items = ref([
    { id: 0, item: '', count: 0 }
])
const scores = ref([
    { id: 0, name: '', score: 0 }
])

onMounted(async () => {
    //fetch all bingo items
    items.value = await getBingoItems()
    //sort by count in descending order
    items.value.sort((a, b) => b.count - a.count)
    scores.value = await getAllUsers()
    //sort by score in descending order
    scores.value.sort((a, b) => b.score - a.score)
})

</script>
<style scoped>
.list {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
}
</style>