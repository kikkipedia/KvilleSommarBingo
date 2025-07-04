<template>
    <div v-if="store.isAuth && store.team" class="container">
       <!-- different flag color for different team-->
        <div class="scoreboard">
          <span  class="material-symbols-outlined filledWhite">flag</span> {{ whitePoints }} -  
          {{ redPoints }}<span  class="material-symbols-outlined filled">flag</span> 
        </div>
      
      <!-- <p class="points">Poäng: {{ teamArray?.points }}</p> -->
      <div class="teamMembers">
        <h2>Era nedsatta flaggor just nu:</h2>
        <p v-for="item in flags"><b>{{item.name }},</b> <em>{{ item.adress }}</em></p>
      </div>
      <v-btn
        v-if="!openRules"
        class="ma-6"
        color="#7400FF"
        @click="openRules = true"
        >Regler</v-btn>
      <v-dialog v-model="openRules" width="90%">
        <v-card style="overflow-y: auto;">
          <v-card-text class="infotext">
            <h2>Nytt 2025</h2>
            <ul>
              <li>Du måste registrera dig på nytt!</li>
              <li>När du registrerar dig slumpas du in i ett lag. Röda eller vita laget! Tänk röda/vita rosen.</li>
              <li>Ibland när du kryssar sätts en flagga ner. Laget får då 1p! Denna flagga ska det andra laget ta - genom att kryssa samma sak inom en radie på 30m.</li>
              <li>Då får laget 1p samtidigt som motståndarlaget får -1p.</li>
              <li>En flagga kan inte sättas utanför Kville!</li>
              <li>För att delta i Capture the flag måste du tillåta platsspårning i din webläsare</li>
              <li>Karta <v-icon small>mdi-map-legend</v-icon>  och teamsida <v-icon small>mdi-flag-checkered</v-icon> nås via ikonerna högst upp.</li>
            </ul>
          </v-card-text>
          <v-btn
            @click="openRules = false"
            color="#7400FF"
            class="ma-6"
          >OK</v-btn>
        </v-card>
      </v-dialog>
      <div class="teamMembers">
        <h2>Medlemmar:</h2>
         <v-row no-gutters>
          <v-col
            v-for="n in members"
            cols="6"
            sm="4"
          >
            <v-sheet class="memberlist">
              {{ n.name }}
            </v-sheet>
          </v-col>
        </v-row>
      </div>  
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBingoStore } from '@/stores';
import { fetchTeamById, fetchUserById, fetchOwnFlags, getBingoItemById, fetchAdressByCoords } from '@/db';
import type { Team, User, Flag } from '@/types';

const store = useBingoStore()
const team = ref('')
const teamArray = ref<Team | null>(null)
const members = ref<User[]>([])
const flags = ref<Flag[]>([])
const whitePoints = ref(0)
const redPoints = ref(0)
const openRules = ref(false)

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
      await getTeamPoints()
    } catch (err) {
      console.error('Failed to load team data:', err)
    }
  })()
})

const fetchMembers = async () => {
  try {
    const mem = teamArray.value?.members;
    if (!mem) return;

    const promises = mem.map(memberId =>
      fetchUserById(memberId.id)
        .then(response => {
          if (response) {
            return {
              id: response.id,
              name: response.name,
              score: response.score
            } as User;
          }
          return null;
        })
    );

    const results = await Promise.all(promises);
    members.value = results.filter(Boolean) as User[];
  } catch (err) {
    console.error('Failed to load member data:', err);
  }
};

const fetchFlags = async () => {
  try {
    const response = await fetchOwnFlags(team.value);
    if (!response) return;

    const updatedFlags = await Promise.all(
      (response as Flag[]).map(async (item) => {
        const [name, address] = await Promise.all([
          getBingoItemById(item.item),
          getAddress(item.location._lat, item.location._long)
        ]);
        return {
          ...item,
          name: name?.item || 'Okänt',
          adress: address || 'Ingen adress'
        };
      })
    );

    flags.value = updatedFlags;
  } catch (err) {
    console.error('Failed to load flag data:', err);
  }
};

const getAddress = async (lat: number, long: number) => {
  try {
    const response = await fetchAdressByCoords(lat, long)
    if (!response) {
      console.error('User not found in database')
      return null
    }
    return response
  } catch (err) {
    console.error('Failed to load address data:', err)
    return null
  }
}

const getTeamPoints = async () => {
  try {
    const [white, red] = await Promise.all([
      fetchTeamById('whiteTeam'),
      fetchTeamById('redTeam')
    ]);

    if (!white || !red) throw new Error("One or both teams missing");

    whitePoints.value = white.points;
    redPoints.value = red.points;
  } catch (err) {
    console.error("Failed to fetch team points", err);
  }
};
</script>

<style scoped>
.teamMembers {
  display: flex;
  flex-direction: column;
  padding-left: 5px;
  text-align: left;
  margin: 0px 20px;
  font-family: 'Libre Franklin', sans-serif;
  border: 2px solid #00FF00;
}



.memberlist {
  font-family: 'Libre Franklin', sans-serif;
  font-weight: bold;
  
}

.points {
  font-family: 'Press Start 2P', sans-serif;
  font-size: 1.5rem;
  background-color: #00FF00;
}

.scoreboard {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
  font-family: 'Press Start 2P', sans-serif;
  font-size: 1.5rem;
  background-color: #00FF00;
  padding-top: 5px;
  padding-bottom: 5px;
}
.v-btn {
  margin: 0px;
}
</style>