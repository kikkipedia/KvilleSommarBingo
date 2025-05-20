// @ts-nocheck

<template>
    <div class="login">
        <img src="@/assets/tramsAb.jpg" style="width: 100%"/>
        PRESENTERAR STOLT
        <img src="@/assets/bingologo.png" class="bingologo" alt="Bingo logo"/>
        <v-btn color="#7400FF" @click="openLogin = true" v-if="!openLogin">Logga in med email</v-btn>
        <v-dialog v-model="openReset" width="90%">
            <v-btn
                color="rgb(10, 150, 125)"
                icon="mdi-close"
                @click="openReset = false"
            ></v-btn>
            <v-card>
                <v-card-text>
                    <div><PswdReset/></div>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-form @submit.prevent="userSubmit" v-if="openLogin">

            <v-text-field
                v-model="email"
                label="Email"
                required
                :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
                v-model="password"
                type="password "
                label="Password"
                required
                :rules="[rules.required]"
            ></v-text-field>
            <p v-if="errorMsg != ''" style="color: red">{{ errorMsg }}! Nånting gick fel!</p>
            <v-btn type="submit" color="#00FF00">Play bingo!</v-btn>
        </v-form>
        <p><span class="link" @click="openReset = true">glömt lösenord?</span></p>
        <v-btn color="pink" @click="openRegister = true" v-if="!openRegister" size="small">Registrera</v-btn>
        <Register v-if="openRegister"/>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import router from '@/router';
import { fetchUserById } from '@/db';
import { useBingoStore } from '@/stores';
import Register from './Register.vue';
import PswdReset from './PswdReset.vue';

const email = ref('');
const password = ref('');

const store = useBingoStore()
const errorMsg = ref('');
const openRegister = ref(false);
const openReset = ref(false);
const openLogin = ref(false);

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
            store.isAuth = true;
            fetchUserById(userCredential.user.uid)
                .then((response) => {
                    console.log(response);
                    if (response) {
                        localStorage.setItem('userName', response.name);
                        store.setTeam(response.team);
                        localStorage.setItem('team', response.team);
                        store.isAuth = true;
                        location.reload();
                    } else {
                        errorMsg.value = 'User data not found';
                    }
                });
            
        })
        .catch((error) => {
            const errorCode = error.code;
            //const errorMessage = error.message;
            errorMsg.value = errorCode;
            error.value = true;
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
    display: block;
}

p {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>