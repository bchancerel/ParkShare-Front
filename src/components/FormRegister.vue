<template>
    <div class="container px-0 pt-5 pb-3 p-lg-5 w-75">
        <h1 class="display-4 mb-5">Inscription</h1>  
        <div class="alert alert-danger" v-if="error == true" role="alert">
            A simple danger alert—check it out!
        </div>                  
        <div class="input-group mb-3">
            <input type="text" name="email" class="form-control" placeholder="Firstname" maxlength="150" required="" id="firstname">
        </div>
        <div class="input-group mb-3">
            <input type="text" name="email" class="form-control" placeholder="Lastname" maxlength="150" required="" id="lastname">
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

        <p id="#" class="detail me-3 mb-1" style="position: fixed;bottom: 0;right: 0;">Retourner à l' <a href="/" class="detail">Accueil</a>.</p>
    </div>
</template>

<script>
import JQuery from 'jquery'
import Axios from 'axios'
const $ = JQuery
window.JQuery = $

export default {
    name: 'FormRegister',
    data () {
        return {
            url : 'http://localhost:8080/api/user/register',
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            roleId : 1,
            error: false,
            loading: false,
            idToken: '',
        }
    },
    methods: {
        Submit() {
            console.log("submit")
            this.loading = true

            var firstname   = $('#firstname').val();
            var lastname    = $('#lastname').val();
            var email       = $('#id_email').val();
            var password    = $('#id_password').val();

            this.firstname  = firstname
            this.lastname   = lastname
            this.email      = email
            this.password   = password

            var data = {
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                password: this.password,
                roleId: this.roleId,
            }

            Axios.post(this.url, data)
            .then(response => {
                if(response.status.toString().startsWith('2')) {
                    console.log("welcome !")
                    console.log(response.data)
                    this.idToken = response.data.idToken
                    this.loading = false
                    this.login(this.email, this.password)
                    window.location.href = '/app'
                } else {
                    this.loading = false
                    this.error = true
                    console.log(response.status)
                }
            })
            .catch(error => {
                this.loading = false
                console.log(error)
            })
        },
        login(email, password) {
            var data = {
                email: email,
                password: password,
                returnSecureToken: true
            };

            Axios.post('http://localhost:8080/api/user/authentication', data)
            .then(response => {
                if(response.status.toString().startsWith('2')) {
                    console.log("welcome !");
                    console.log(response.data);
                    
                    // Enregistre le idToken dans le localStorage
                    this.idToken = response.data.idToken;
                    localStorage.setItem('idToken', this.idToken);
                    localStorage.setItem('userId', response.data.localId)

                    
                    this.loading = false;
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