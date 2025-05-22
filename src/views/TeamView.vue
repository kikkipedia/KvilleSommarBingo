<template>
    <div v-if="store.isAuth && store.team" class="container">
       <!-- different flag color for different team-->
      <span v-if="store.team == 'whiteTeam'" class="material-symbols-outlined">flag</span>
      <span v-else-if="store.team == 'readTeam'" class="material-symbols-outlined filled">flag</span>
      <p>{{ teamArray?.points }} poäng</p>
      <div class="teamMembers">
        <h2>Era flaggor:</h2>
        <p v-for="item in flags">{{item.name }}, {{ item.location.latitude }}, {{ item.location.longitude }}</p>
      </div>
      <div class="teamMembers">
        <h2>Medlemmar:</h2>
        <p v-for="member in members">{{ member.name }}</p>
      </div>  
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBingoStore } from '@/stores';
import { fetchTeamById, fetchUserById, getTeamFlags } from '@/db';
import type { Team, User } from '@/types';

const store = useBingoStore()
const team = ref('')
const teamArray = ref<Team | null>(null)
const members = ref<User[]>([])
const flags = ref<Flag[]>([])

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
      // Map Firestore DocumentData to Team type
      teamArray.value = {
        id: response.id, //this is whiteTeam or redTeam
        members: response.members,
        points: response.points
      }
      await fetchMembers()
      await fetchFlags()
    } catch (err) {
      console.error('Failed to load team data:', err)
    }
  })()
})

const fetchMembers = async () => {
  try {
    //member ids are in teamArray.value.members
    const mem = teamArray.value?.members
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
      // Map Firestore DocumentData to User type
      members.value.push({
        id: response.id,
        name: response.name,
        score: response.score
      })
    }
  } catch (err) {
    console.error('Failed to load member data:', err)
  }
}

const fetchFlags = async () => {
  try {
    const response = await getTeamFlags(team.value)
    if (!response) {
      console.error('Team not found in database')
      return
    }
    // Map Firestore DocumentData to Team type
    flags.value = response.flags
    flags.value.forEach(async item => {
      // items.item is and name should be fetched and added to the item
      const name = await getBingoItemById(item.item);
      if (!name) {
        return;
      }
      else {
        //add to flag
        item.name = name.item
      }

    })
    console.log('Flags:', flags.value)
  } catch (err) {
    console.error('Failed to load flag data:', err)
  }
}



</script>

<style scoped>
.teamMembers {
  display: flex;
  flex-direction: column;
  padding-left: 5px;
  text-align: left;
  margin-top: 20px;
}
</style>