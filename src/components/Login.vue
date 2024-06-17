<template>
    <div>
        <v-form @submit.prevent="userSubmit">
            <v-text-field
                v-model="email"
                label="Email"
                required
                :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
                v-model="password"
                label="Password"
                required
                :rules="[rules.required]"
            ></v-text-field>
            <v-btn type="submit">Play bingo!</v-btn>
        </v-form>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import router from '@/router';

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

            router.push('/');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
}
</script> 

<style scoped>
</style>