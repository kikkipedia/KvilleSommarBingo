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
        <v-btn :disabled="!userName" color="#EB00D7" class="mt-2" type="submit" block @click="userSubmit">Registrera</v-btn>
    </v-form>
    <v-snackbar v-model="showSnackbar" color="success">
        Email verification sent to {{ email }}. Please verify your email before logging in.
        <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>

    </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, sendSignInLinkToEmail } from 'firebase/auth';
import { useBingoStore } from '@/stores';
import  router from '@/router';

const email = ref('');
const userName = ref();
const password = ref('');
const userCredentials = ref();
const showSnackbar = ref(false);

const store = useBingoStore();

interface Rules {
    required: (value: any) => boolean | string;
}

const rules: Rules = {
    required: (value) => !!value || 'Field is required',
};


const userSubmit = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            //console.log(userCredential.user)
        // Signed in 
        const user = userCredential.user;
        console.log(user.uid);
        localStorage.setItem('userId', user.uid);

    sendEmail()
    setUser()
  })
  .catch((error) => {
    error.code;
    error.message;
    // TODO show error message
  });
    
}   

const sendEmail = () => {
    const actionCodeSettings = {
        url: 'http://kvillbingo.web.app/login',
        handleCodeInApp: true,
    };
    const auth = getAuth();
    //send email verification
    if (auth.currentUser) {
        sendEmailVerification(auth.currentUser, actionCodeSettings)
        .then(() => {
            //redirect to login
            redirect()
    //     // Email verification sent!
         showSnackbar.value = true; //todo show in middle of screen
     });
    }
}

const setUser = () => {
    //set in local storage and store
    localStorage.setItem('user', userName.value);
    store.setName(userName.value);
    //todo set userId
}

const redirect = () => {
    //redirect to login
    router.push('/login')
}

</script>

<style scoped>
.info {
    font-size: 0.9em;
    margin: 20px;
    text-align: left;
}
</style>