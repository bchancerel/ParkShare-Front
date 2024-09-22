<template>
    <div class="container mt-4">
        <div class="card mx-5 p-3">
            <form @submit.prevent="submitForm">
                <div class="mb-3">
                    <label for="firstName" class="form-label">First Name</label>
                    <input type="text" :placeholder="profilInfo.firstname" class="form-control" id="firstName" v-model="formData.firstName">
                </div>
      
                <div class="mb-3">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input type="text" :placeholder="profilInfo.lastname" class="form-control" id="lastName" v-model="formData.lastName" >
                </div>
      
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" :placeholder="profilInfo.email" class="form-control" id="email" v-model="formData.email" >
                </div>

                <div v-if="loading1 == true" class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <button v-else type="submit" class="btn btn-success mt-2 mb-3">Mise à jour des infos de profile</button>
            </form>
            <hr class="my-3">

            <form @submit.prevent="submitPwd">
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" v-model="formDataPwd.password" required>
                </div>
      
                <div class="mb-3">
                    <label for="confirmPassword" class="form-label">Confirm Password</label>
                    <input type="password" class="form-control" id="confirmPassword" v-model="formDataPwd.confirmPassword" required>
                </div>
                <div v-if="loading1 == true" class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <button v-else type="submit" class="btn btn-success">Mise à jour du mot de passe</button>

            </form>
            
        </div>
    </div>
</template>
  
<script>
    export default {
        data() {
            return {
                apiUrl: 'http://localhost:8080/api/user/',
                formData: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    roleId: 1
                },
                formDataPwd: {
                    password: '',
                    confirmPassword: ''
                },
                profilInfo: {},
                loading1: false,
                loading2: false
            };
        },
        mounted () {
            this.getInfoUSer()
        },
        methods: {
            // Méthode pour soumettre le formulaire
            async submitForm() {
                this.loading1 = true
                try {
                    const userId = localStorage.getItem('userId');
                    const idToken = localStorage.getItem('idToken');

                    // Construire l'URL avec l'ID de l'utilisateur
                    const url = `${this.apiUrl}${userId}`;

                    if (this.formData.firstName == '') {
                        this.formData.firstName = this.profilInfo.firstname
                    }

                    if (this.formData.lastName == '') {
                        this.formData.lastName = this.profilInfo.lastname
                    }

                    if (this.formData.email == '') {
                        this.formData.email = this.profilInfo.email
                    }

                    // Créer l'objet à envoyer dans le corps de la requête
                    const updatedData = {
                        firstname: this.formData.firstName,
                        lastname: this.formData.lastName,
                        email: this.formData.email,
                        roleId: this.formData.roleId // Le roleId est 1 par défaut mais peut être modifié si nécessaire
                    };
                    console.log(updatedData)

                    // Faire la requête PUT avec Fetch
                    const response = await fetch(url, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${idToken}`, // Ajoute le token dans les headers
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedData)
                    });

                    console.log(response)
                    if (response.status == 204) {
                        console.log("success")
                        this.getInfoUSer()
                    }
                } catch (error) {
                    console.error('Erreur lors de la soumission du formulaire:', error);
                    alert('Une erreur est survenue lors de la soumission du formulaire');
                }
                this.loading1 = false
            },
            async submitPwd() {
                this.loading2 = true
                try {
                    const userId = localStorage.getItem('userId')
                    const idToken = localStorage.getItem('idToken')

                    const url = 'http://localhost:8080/api/user/changepwd/' + userId

                    const updatedData = {
                        password: ""
                    }

                    if (this.formDataPwd.password === this.formDataPwd.confirmPassword) {
                        updatedData.password = this.formDataPwd.password

                        console.log(updatedData)

                        const response = await fetch(url, {
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Bearer ${idToken}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updatedData)
                        })

                        console.log(response.status)
                        if (response.status == 204) {
                            console.log("success")
                            alert("La modification de votre mot de passe a été prise en compte")
                            this.getInfoUSer()
                        }

                    } else {
                        alert("Vous avez entré deux mots de passe différents")
                    }   
                } catch (error) {
                    console.error('Erreur lors de la soumission du formulaire:', error)
                }
                this.loading2 = false
            },
            async getInfoUSer() {
                try {
                    const userId = localStorage.getItem('userId');
                    const idToken = localStorage.getItem('idToken');

                    // Construire l'URL avec l'ID de l'utilisateur
                    const url = `http://localhost:8080/api/user/${userId}`;

                    // Faire la requête GET avec Axios
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${idToken}`, // Ajoute le token dans les headers
                            'Content-Type': 'application/json'
                        }
                    });

                    // Afficher les données de l'utilisateur
                    const data = await response.json();
                    console.log(data)
                    this.profilInfo = data
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        }
    }
</script>
  
<style scoped>

</style>
  