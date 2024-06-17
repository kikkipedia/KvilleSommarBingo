<template>
    <div>
        <p class="info">
            För att spela Bingo och kunna spara din bricka och poäng behöver du registrera dig med email, och
            sedan logga in. Detta behöver du förhoppningsvis bara göra en gång.
        </p>
        <v-form @submit.prevent>
        <v-text-field
            solo dense
            label="Namn"
            placeholder="Ange bingonamn"
            :rules="[rules.required]"
            v-model="user"
        >
        </v-text-field>
        <v-text-field
            solo dense
            label="Email"
            placeholder="Ange emailadress"
            type="email"
            :rules="[rules.required]"
        >
        </v-text-field>
        <v-text-field
            solo dense
            label="Lösenord"
            placeholder="Ange lösenord"
            type="password"
            :rules="[rules.required]"
        >
        </v-text-field>
        <v-btn :disabled="!user" color="#EB00D7" class="mt-2" type="submit" block @click="userSubmit">Registrera</v-btn>
    </v-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const name = ref('');
const email = ref('');
const user = ref();
const password = ref('');
const userCredentials = ref();

interface Rules {
    required: (value: any) => boolean | string;
}

const rules: Rules = {
    required: (value) => !!value || 'Field is required',
};


const userSubmit = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email.value, 'password')
        .then((userCredential) => {
        // Signed in 
            userCredentials.value = userCredential.user;
        // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
    
    console.log('User submitted');
    setUser()
}   

const setUser = () => {
    //set in local storage
    localStorage.setItem('user', user.value);
}

</script>

<style scoped>
.info {
    font-size: 0.9em;
    margin: 20px;
    text-align: left;
}
</style>