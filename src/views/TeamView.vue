<template>
    <div v-if="store.isAuth && store.team" class="container">
        {{ team }}, {{ teamArray.points }} poäng
        <h2>Medlemmar:</h2>
        <p v-for="member in members">{{ member.name }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBingoStore } from '@/stores';
import { fetchTeamById, fetchUserById } from '@/db';

const store = useBingoStore()
const team = ref('')
const teamArray = ref([])
const members = ref([])

onMounted(() => {
  (async () => {
    try {
      const stored = localStorage.getItem('team') ?? ''
      team.value = stored
      if (!stored) {
        store.setTeam('')
        return
      }
      store.setTeam(stored)
      const response = await fetchTeamById(stored)
      if (!response) {
        console.error('Team not found in database')
        return
      }
      teamArray.value = response
      await fetchMembers()
    } catch (err) {
      console.error('Failed to load team data:', err)
    }
  })()
})

const fetchMembers = async () => {
  try {
    //member ids are in teamArray.value.members
    const mem = teamArray.value.members
    if (!mem) {
      console.error('No members found in team data')
      return
    }
    //fetch every member for each member id in mem and add to members.value
    for (const memberId of mem) {
      const response = await fetchUserById(memberId.id)
      if (!response) {
        console.error(`Member ${memberId} not found in database`)
        continue
      }
      members.value.push(response)
    }
  } catch (err) {
    console.error('Failed to load member data:', err)
  }
}



</script>

<style scoped>

</style>