<template>
    <div>
        <canvas id="checkedChart"></canvas>
        <canvas id="scoreChart"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Chart from 'chart.js/auto';
import { getBingoItems, getAllUsers } from '@/db';

type CheckedChart = {
    id: string;
    name: string;
    checked: number;
}

type TopScorers = {
    id: string;
    name: string;
    score: number;
}

const checkedChart = ref<CheckedChart[]>([])
const scoreChart = ref<TopScorers[]>([])

//fetch all BingoItems from database
const getItems = async() => {
    const response = await getBingoItems()
    checkedChart.value = response.map((item) => {
        return {
            id: item.id,
            name: item.item,
            checked: item.checked
        }
    })
}

//fetch all user scores from database
const getScores = async() => {
    const response = await getAllUsers()
    scoreChart.value = response.map((user: any) => {
        return {
            id: user.id,
            name: user.name,
            score: user.score
        }
    })
}


onMounted(() => {
    getItems()
    getScores()
    document.getElementById('checkedChart')
    document.getElementById('scoreChart')
})

</script>


<style scoped>
</style>