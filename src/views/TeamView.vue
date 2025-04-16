<template>
    <div v-if="store.isAuth" class="container">
        {{ team }}, {{ teamArray.points }} poäng
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBingoStore } from '@/stores';
import { fetchTeamById } from '@/db';

const store = useBingoStore()
const team = ref('')
const teamArray = ref([])

onMounted(async() => {
    team.value = localStorage.getItem('team') || ''
    if (team.value) {
        store.setTeam(team.value)
        const response = await fetchTeamById(team.value)
        console.log(response.members)
        teamArray.value = response
        //for every team.id in response, fetch user by id


    } else {
        store.setTeam('')
    }
})
</script>

<style scoped>

</style>