<template>
    <div class="login">
        <img src="../assets/bingologo.png" alt="logo" class="bingologo"/>
        <v-form @submit.prevent="userSubmit">
            <v-text-field
                v-model="email"
                label="Email"
                required
                :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
                v-model="password"
                type="password"
                label="Password"
                required
                :rules="[rules.required]"
            ></v-text-field>
            <v-btn type="submit" color="#7400FF">Play bingo!</v-btn>
        </v-form>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import router from '@/router';
import { fetchUserById } from '@/db';

const email = ref('');
const password = ref('');

interface Rules {
    required: (value: any) => boolean | string;
}

const rules: Rules = {
    required: (value) => !!value || 'Field is required',
};

const userSubmit = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            localStorage.setItem('userId', userCredential.user.uid);
            fetchUserById(userCredential.user.uid)
                .then((response) => {
                    console.log(response);
                    localStorage.setItem('userName', response);
                    router.push({ path: '/' }); //this doesnt update component
                });
            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
}
</script> 

<style scoped>
.login {
    text-align: center;
    max-width: 80%;
    margin: 0 auto;
}

.bingologo {
    width: 150px;
    margin: 0 auto;
}
</style>