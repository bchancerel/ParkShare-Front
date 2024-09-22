<template>
    <div class="container my-auto px-0 py-3 p-lg-5 w-75">
        <h1 class="display-4 mb-3">Bienvenue !</h1>
        <div class="mb-3">
            <div class="alert alert-danger" v-if="error == true" role="alert">
                A simple danger alert—check it out!
            </div>     
            <div class="input-group mb-3">
                <input type="text" name="email" class="form-control" placeholder="Email" maxlength="150" required="" id="id_email">
            </div>
            <div class="input-group mb-3">
                <input type="password" name="password" class="form-control" placeholder="Password" required="" id="id_password">
            </div>
            <div v-if="loading == true" class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <button v-else class="btn btn-primary btn-block col-lg-4" @click="Submit">Valider</button>
        </div>
        <p id="#" class="detail me-3 mb-1" style="position: fixed;bottom: 0;right: 0;">Retourner à l' <a href="/" class="detail">Accueil</a>.</p>
    </div>
</template>

<script>
import JQuery from 'jquery'
import Axios from 'axios'
const $ = JQuery
window.JQuery = $

export default {
    name: 'FormLogin',
    data () {
        return {
            url : 'http://localhost:8080/api/user/authentication',
            email: '',
            password: '',
            returnSecureToken: true,
            error: false,
            loading: false,
            idToken: '',
        }
    },
    methods: {
        Submit() {
            console.log("submit");
            this.loading = true;

            var email = $('#id_email').val();
            var password = $('#id_password').val();

            this.email = email;
            this.password = password;

            var data = {
                email: this.email,
                password: this.password,
                returnSecureToken: this.returnSecureToken
            };

            Axios.post(this.url, data)
            .then(response => {
                if(response.status.toString().startsWith('2')) {
                    console.log("welcome !");
                    console.log(response.data);
                    
                    // Enregistre le idToken dans le localStorage
                    this.idToken = response.data.idToken;
                    localStorage.setItem('idToken', this.idToken);
                    localStorage.setItem('userId', response.data.localId)
                    
                    this.loading = false;
                    window.location.href = '/app';  // Redirection après succès
                } else {
                    this.loading = false;
                    this.error = true;
                    console.log(response.status);
                }
            })
            .catch(error => {
                this.loading = false;
                this.error = true;  // Affiche l'erreur si la requête échoue
                console.log(error);
            });
        }
    }
}
</script>