<template>
    <div id="app">
        <div class="w-100 position-relative">
            <div class="row justify-content-end w-100 h-100">
                <div class="col-12 col-12 col-md-6 text-center">
                    <div class="row justify-content-between w-100">
                        <div class="col" @click="showLoginForm">
                            <h2 class="my-3">Login</h2>
                            <div v-if="activeForm === 'login'" class="w-100 select"></div>
                        </div>
                        <div class="col" @click="showRegisterForm">
                            <h2 class="my-3">Register</h2>
                            <div v-if="activeForm === 'register'" class="w-100 select"></div>
                        </div>
                    </div>
                    <div class="h-75 d-flex align-items-center">
                        <FormLogin v-if="activeForm === 'login'"/>
                        <FormRegister v-if="activeForm ==='register'"/>
                    </div>
                </div>
                <div class="d-none d-md-block col-6 p-0 order-first overflow-hidden">
                    <img class="w-100" src="../assets/static/login.png" alt="">
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import FormLogin from '@/components/FormLogin.vue'
import FormRegister from '../components/FormRegister.vue';
// @ is an alias to /src
  
export default {
    name: 'LoginView',
    components: {
        FormLogin,
        FormRegister
    },
    data() {
        return {
            activeForm: 'login' // Par défaut, le formulaire de connexion est actif
        };
    },
    methods: {
        showLoginForm() {
            this.activeForm = 'login'
        },
        showRegisterForm() {
            this.activeForm = 'register'
        },
    }
}
</script>

<style lang="scss">

.select {
    background-color: #39743F;
    padding: 2px;
    box-shadow: 0 4px 9px #39743F;
}
</style>
  