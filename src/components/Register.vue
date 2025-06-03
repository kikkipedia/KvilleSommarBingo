<template>
    <div class="register">
        <v-alert v-model="showSnackbar"
        border="start"
        border-color="deep-purple accent-4"
        elevation="2"
        closable
        >
        Email verification sent to {{ email }}. Please verify your email before logging in.
    </v-alert>
        <v-form @submit.prevent>
        <v-text-field
            solo dense
            label="Namn"
            placeholder="Ange bingonamn"
            :rules="[rules.required]"
            v-model="userName"
        >
        </v-text-field>
        <v-text-field
            solo dense
            label="Email"
            placeholder="Ange emailadress"
            type="email"
            :rules="[rules.required]"
            v-model="email"
        >
        </v-text-field>
        <v-text-field
            solo dense
            label="Lösenord"
            placeholder="Ange lösenord"
            type="password"
            :rules="[rules.required]"
            v-model="password"
        >
        </v-text-field>
        <v-btn :disabled="!userName" color="#7400FF" class="mt-2" type="submit" block @click="userSubmit">Registrera</v-btn>
    </v-form>
    <!-- register with Google -->
    
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useBingoStore } from '@/stores';
import  router from '@/router';
import { saveNewUser } from '@/db';

const email = ref('');
const userName = ref();
const password = ref('');
const userCredentials = ref();
const showSnackbar = ref(false);
const team = ref(''); //röda vita rosen

const error = ref(null);

const store = useBingoStore();

interface Rules {
    required: (value: any) => boolean | string;
}

const rules: Rules = {
    required: (value) => !!value || 'Field is required',
};

const saveUserInDb = async(id: string) =>{
    //random team red or white
    team.value = Math.random() < 0.5 ? "redTeam" : "whiteTeam";
    store.setTeam(team.value)
    localStorage.setItem('team', team.value)
    //save new user in db
    const response = await saveNewUser(id, userName.value, team.value)
    localStorage.setItem('userId', response)
    
    console.log('in register:', response)
    location.reload()
}


const userSubmit = async () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        //save as post in db
        saveUserInDb(user.uid)
        //sendEmail()
        setUser()
        localStorage.setItem('userId', user.uid);
        store.isAuth = true;
        //location.reload()
  })
  .catch((error) => {
    error.code;
    error.value = error.message;
    // TODO show error message
  });
    
}   

const sendEmail = () => {
    const actionCodeSettings = {
        url: 'http://kvillebingo.web.app/', 
        handleCodeInApp: true,
    };
    const auth = getAuth();
    //send email verification
    if (auth.currentUser) {
        sendEmailVerification(auth.currentUser, actionCodeSettings)
        .then(() => {
            console.log('Email verification sent');
            showSnackbar.value = true;
            redirectHome();
            
     });
    }
}

const setUser = () => {
    //set in local storage and store
    localStorage.setItem('userName', userName.value);
    store.setName(userName.value);
    //todo set userId
}

const redirectHome = () => {
    showSnackbar.value = false;
    location.reload()
}


</script>

<style scoped>

.register {
    text-align: center;
    max-width: 100%;
    margin: 0 auto;
}

.bingologo {
    width: 150px;
    margin-top: 20px;
}
</style>