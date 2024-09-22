<template>
    <a href="/profil">
        <div class="back-icon m-3">
        </div>
    </a>
    <div class="mx-5 my-5">
        <div class="d-flex mb-5">
            <div class="col-6 overflow-auto px-3">
                <div class="row">

                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-12">
                                <img src="../assets/static/image.png" class="img-fluid" alt="">
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-6">
                                <img src="../assets/static/image.png" class="img-fluid" alt="">
                            </div>
                            <div class="col-6">
                                <img src="../assets/static/image.png" class="img-fluid" alt="">
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <h3>{{ parkingSpots.name }}</h3>
                        <div class="description mb-3">
                            <h5>Description</h5>
                            <p>
                                {{parkingSpots.description}}
                            </p>
                        </div>
                        <!-- Section Carte -->
                        <div class="map-container">
                            <hr>
                            <p>By : <strong> {{ user.firstname }} {{ user.lastname }} </strong></p>
                            <p><strong> {{ parkingSpots.rating }} </strong> ⭐ | {{ parkingSpots.hourPrice }} € / h</p>
                        </div>
                    </div>

                </div>
            </div>

            <div class="col-6">
                <form @submit.prevent="submitForm">
                    <div class="mb-3">
                        <label for="commentaire" class="form-label">Laissez un commentaire</label>
                        <textarea style="height: 200px;" type="text" class="form-control" id="firstName" v-model="formData.description"></textarea>
                    </div>
                    <div class="mb-3">
                        <div class="btn-group btn-group-toggle" data-toggle="buttons">
                            <label class="btn btn-primary" v-for="number in 5" :key="number">
                                <input type="radio" name="rating" :value="number" v-model="formData.rating" autocomplete="off"> {{ number }}
                            </label>
                        </div>
                    </div>
                    <div v-if="loading == true" class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <button v-else type="submit" class="btn btn-primary mt-2 mb-3">Poster Commentaire</button>
                </form>
            </div>
        </div>
         <!-- Section des commentaires -->
        <hr>
        <div class="comments mt-5">
            <h5>Commentaires d'autres Utilisateurs</h5>
            <div class="row">
                <div v-for="(item, index) in feedbacks" :key="index" class="col-md-6">
                    <div class="card mb-3">
                        <div v-if="item.userId === userId" @click="deleteFeedback(item.id)" class="delete-icon m-2">
                        </div>
                        <div class="card-body">
                            <div class="icon-croix"></div>
                            <p><strong>{{ item.firstname }} {{ item.lastname }}</strong></p>
                            <p>{{ item.description }}</p>
                            <p>{{ item.rating }} ⭐</p>
                            <p>écrit le : <strong>{{ formatDate(item.date) }}</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'FeedBackView',
    data() {
        return {
            parkingSpots: {},
            apiurl: 'http://localhost:8080/api/feedback/ad/',
            getad: 'http://localhost:8080/api/ads/',
            createFeedback: 'http://localhost:8080/api/feedback',
            feedbacks: [],
            loading: false,
            formData: {
                description: '',
                rating: 0
            },
            userId : '',
            user: {
                firstname: '',
                lastname: ''
            }
        }
    },
    mounted() {
        this.fetchParkingSpots()
        const iduser = localStorage.getItem('userId')
        this.userId = iduser
    },
    beforeCreate() {
        const idToken = localStorage.getItem('idToken')
        console.log(idToken)
        if (!idToken) {
            console.warn('idToken is missing in localStorage. Redirecting to login...')
            // Redirection vers la page de connexion ou une autre action à définir
            window.location.href = '/connexion'  // Redirection après succès
        }
    },
    methods: {
        async fetchParkingSpots() {
            if (this.getad !== '') {
                const id = this.$route.params.id
                try {
                    const token = localStorage.getItem('idToken') 
                    const response = await fetch(this.getad +  id, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })
                    if (!response.ok) throw new Error('API call failed')
                    const data = await response.json()
                    this.parkingSpots = data

                    this.NoteAd(this.parkingSpots)
                    this.getUser(this.parkingSpots.userId)
                } catch (error) {
                    console.log("coucou")
                    console.error(error)
                }
            } else {
                console.log("error")
            }
        },
        async getUser(id) {
            const idToken = localStorage.getItem('idToken');

            const url = `http://localhost:8080/api/user/${id}`

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json()
            console.log(data)
            this.user.firstname = data.firstname
            this.user.lastname = data.lastname
        },
        async NoteAd(item) {
            try {
                const token = localStorage.getItem('idToken') 
                const response = await fetch(this.apiurl + item.id, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json'
                    }
                })
                if (!response.ok) throw new Error('Failed to fetch ratings')
                const data = await response.json()
                this.feedbacks = data
                for (let i in this.feedbacks) {
                    const url = `http://localhost:8080/api/user/${this.feedbacks[i].userId}`

                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    const data = await response.json()
                    this.feedbacks[i].firstname = data.firstname
                    this.feedbacks[i].lastname = data.lastname
                }
                console.log(this.feedbacks)
                let averageRating = 0 
                if (data.length > 0) {
                    averageRating = data.reduce((acc, curr) => acc + curr.rating, 0) / data.length
                }
                this.parkingSpots.rating = averageRating.toFixed(1)
                return averageRating
            } catch (error) {
                console.error(error)
                this.parkingSpots.rating = 0
                return 0
            }
        },

        async submitForm() {
            this.loading = true
            try {
                const idToken = localStorage.getItem('idToken');
                const date = new Date().toISOString()
                const dateFormat = date.slice(0, -5)

                // Créer l'objet à envoyer dans le corps de la requête
                const updatedData = {
                    adId: this.parkingSpots.id,
                    rating: this.formData.rating,
                    description: this.formData.description,
                    date: dateFormat
                };
                console.log(updatedData)

                // Faire la requête PUT avec Fetch
                const response = await fetch(this.createFeedback, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${idToken}`, // Ajoute le token dans les headers
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });

                console.log(response)
                if (response.status == 201) {
                    console.log("success")
                    this.formData = {
                        description: '',
                        rating: 0
                    }
                    const data = await response.json();
                    console.log(data)
                    this.feedbacks.push(data)
                }
            } catch (error) {
                console.error('Erreur lors de la soumission du formulaire:', error);
                alert('Une erreur est survenue lors de la soumission du formulaire');
            }
            this.loading = false
        },

        async deleteFeedback(id) {
            if (this.apiurl != '') {
                try {
                    const idToken = localStorage.getItem('idToken');

                    const url = this.createFeedback + '/' + id

                    const response = await fetch(url, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${idToken}`, // Ajoute le token dans les headers
                            'Content-Type': 'application/json'
                        }
                    })

                    if (response.status == 204) {
                        this.feedbacks.splice(id, 1)
                        location.reload()
                    }

                } catch (error) {
                    console.log(error)
                }

            } else {
                console.log("error")
            }
        },

        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('fr-FR', options);
        }
    }
}

</script>

<style lang="scss">
.delete-icon {
    width: 30px;
    height: 30px;
    background: url('../assets/static/annuler.png') no-repeat center center;
    background-size: contain;
}
</style>