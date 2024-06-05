<template>
    <div>
        Noting here yet
        <canvas id="checkedChart"></canvas>
        <canvas id="scoreChart"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Chart from 'chart.js/auto';

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

//todo: fetch all BingoItems from database

//sort to chart

//todo: fetch all user scores from database

//sort to chart

onMounted(() => {
    document.getElementById('checkedChart')
    document.getElementById('scoreChart')
})

</script>


<style scoped>
</style>