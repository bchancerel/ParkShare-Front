<template>
    <div class="mx-5 px-5">
        <div class="container px-5">
            <div class="my-5 d-flex justify-content-center tab-container-inverse">
                <div class="tab-inverse" 
                     :class="{ 'active-inverse': activeDiv === 'Confirm' }"
                     @click="showConfirmed">Confirmée</div>
                <div class="tab-inverse" 
                     :class="{ 'active-inverse': activeDiv === 'Waiting' }"
                     @click="showWaiting">En Attente</div>
                <div class="tab-inverse" 
                     :class="{ 'active-inverse': activeDiv === 'Cancel' }"
                     @click="showCanceled">Annulée</div>
            </div>
        </div>


        <div v-if="activeDiv == 'Confirm'">
            <div class="row" v-if="parkingSpotsConfirmed.length > 0">
                <div v-for="(item, index) in parkingSpotsConfirmed" :key="index" class="card col-12 col-md-6 align-self-center mb-3">
                    <div class="row no-gutters">
                        <div class="col">
                            <img src="../assets/static/image.png" class="card-img h-100" :alt="item.name + ' Image'">
                        </div>
                        <div class="col">
                            <div class="card-body">
                                <h5 class="card-title">{{ item.name }}</h5>
                                <p class="card-text"> {{ item.description }} </p>
                                <p class="card-text">
                                    <span>{{ item.totalPrice }} €</span>
                                </p>
                                <a :href="'/feedback/' + item.adId">
                                    <button class="btn btn-primary">Laiser un avis</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>il n'y a pas de Réservations Confirmées</p>
            </div>
        </div>
        <div v-else-if="activeDiv == 'Waiting'">
            <div class="row" v-if="parkingSpotsWaiting.length > 0">
                <div class="card col-12 col-md-6 align-self-center mb-3 px-3" v-for="(item, index) in parkingSpotsWaiting" :key="index">
                    <div class="row no-gutters">
                        <div class="col">
                            <img src="../assets/static/image.png" class="card-img h-100" :alt="item.name + ' Image'">
                        </div>
                        <div class="col">
                            <div class="card-body">
                                <h5 class="card-title">{{ item.name }}</h5>
                                <p class="card-text">{{ item.description }}</p>
                                <p class="card-text">
                                    <span>{{ item.totalPrice }} €</span>
                                </p>
                                <div v-if="cancelLoading == true" class="spinner-border text-danger" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <button v-else @click="cancelReservations(item.id)" class="btn btn-danger">Annuler</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>il n'y a pas de Réservations en attente</p>
            </div>
        </div>
        <div v-else-if="activeDiv == 'Cancel'">
            <div class="row justify-content-center" v-if="parkingSpotsCanceled.length > 0">
                <div v-for="(item, index) in parkingSpotsCanceled" :key="index" class="card col-12 col-md-6 align-self-center mb-3">
                    <div class="row no-gutters">
                        <div class="col">
                            <img src="../assets/static/image.png" class="card-img h-100" :alt="item.titre + ' Image'">
                        </div>
                        <div class="col">
                            <div class="card-body">
                                <h5 class="card-title">{{ item.name }}</h5>
                                <p class="card-text">
                                    {{ item.description }}
                                </p>
                                <p class="card-text">
                                    <span><s>{{ item.totalPrice }} €</s></span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>Il n'y a pas de Réservations annulées</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProfilView',
    data() {
        return {
            activeDiv: 'Confirm', // Initialize with the profile form active
            parkingSpotsWaiting: [],
            parkingSpotsCanceled: [],
            parkingSpotsConfirmed: [],
            apiurl: 'http://localhost:8080/api/reservation/user/',
            cancelLoading: false
        };
    },

    mounted() {
        this.fetchParkingSpotsConfirmed();
        this.fetchParkingSpotsWaiting();
        this.fetchParkingSpotsCanceled();
    },

    methods: {
        showConfirmed() {
            this.activeDiv = 'Confirm';
            console.log(this.activeDiv)
        },
        showWaiting() {
            this.activeDiv = 'Waiting';
            console.log(this.activeDiv)
        },
        showCanceled() {
            this.activeDiv = 'Cancel';
            console.log(this.activeDiv)
        },
        async fetchParkingSpotsConfirmed() {
            if (this.apiurl != '') {
                try {
                    const userId = localStorage.getItem('userId');
                    const idToken = localStorage.getItem('idToken');

                    const url = this.apiurl + userId + "?statusId=1"
                    
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${idToken}`, // Ajoute le token dans les headers
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) throw new Error('API call failed');
                    const data = await response.json();
                    this.parkingSpotsConfirmed = data;
                    for (const i in this.parkingSpotsConfirmed) {
                        this.parkingSpotsConfirmed[i].name = ""
                        this.parkingSpotsConfirmed[i].description = ""
                        const res = await fetch(`http://localhost:8080/api/ads/${this.parkingSpotsConfirmed[i].adId}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${idToken}`, // Ajoute le token dans les headers
                                'Content-Type': 'application/json'
                            }
                        })
                        const data2 = await res.json()
                        this.parkingSpotsConfirmed[i].name = data2.name
                        this.parkingSpotsConfirmed[i].description = data2.description
                    }
                    console.log(this.parkingSpotsConfirmed)
                } catch (error) {
                    console.error(error);
                    this.setFallbackData();
                }
            } else {
                this.setFallbackData();
            }
        },
        async fetchParkingSpotsWaiting() {
            if (this.apiurl != '') {
                try {
                    const userId = localStorage.getItem('userId');
                    const idToken = localStorage.getItem('idToken');

                    const url = this.apiurl + userId + "?statusId=2"
                    
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${idToken}`, // Ajoute le token dans les headers
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) throw new Error('API call failed');
                    const data = await response.json();
                    this.parkingSpotsWaiting = data;
                    for (const i in this.parkingSpotsWaiting) {
                        this.parkingSpotsWaiting[i].name = ""
                        this.parkingSpotsWaiting[i].description = ""
                        const res = await fetch(`http://localhost:8080/api/ads/${this.parkingSpotsWaiting[i].adId}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${idToken}`, // Ajoute le token dans les headers
                                'Content-Type': 'application/json'
                            }
                        })
                        const data2 = await res.json()
                        this.parkingSpotsWaiting[i].name = data2.name
                        this.parkingSpotsWaiting[i].description = data2.description
                    }
                    console.log(this.parkingSpotsWaiting)
                } catch (error) {
                    console.error(error);
                    this.setFallbackData();
                }
            } else {
                this.setFallbackData();
            }
        },
        async fetchParkingSpotsCanceled() {
            if (this.apiurl != '') {
                try {
                    const userId = localStorage.getItem('userId');
                    const idToken = localStorage.getItem('idToken');

                    const url = this.apiurl + userId + "?statusId=3"
                    
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${idToken}`, // Ajoute le token dans les headers
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) throw new Error('API call failed');
                    const data = await response.json();
                    this.parkingSpotsCanceled = data;
                    for (const i in this.parkingSpotsCanceled) {
                        this.parkingSpotsCanceled[i].name = ""
                        this.parkingSpotsCanceled[i].description = ""
                        const res = await fetch(`http://localhost:8080/api/ads/${this.parkingSpotsCanceled[i].adId}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${idToken}`, // Ajoute le token dans les headers
                                'Content-Type': 'application/json'
                            }
                        })
                        const data2 = await res.json()
                        this.parkingSpotsCanceled[i].name = data2.name
                        this.parkingSpotsCanceled[i].description = data2.description
                    }
                    console.log(this.parkingSpotsCanceled)
                } catch (error) {
                    console.error(error);
                    this.setFallbackData();
                }
            } else {
                this.setFallbackData();
            }
        },
        async cancelReservations(id) {
            this.cancelLoading = true
            if (this.apiurl != '') {
                try {
                    const idToken = localStorage.getItem('idToken');

                    const url = `http://localhost:8080/api/reservation/cancel/${id}`

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${idToken}`, // Ajoute le token dans les headers
                            'Content-Type': 'application/json'
                        }
                    })

                    if (response.status == 200) {
                        this.parkingSpotsWaiting.splice(id, 1)
                        this.fetchParkingSpotsWaiting()
                        this.fetchParkingSpotsCanceled()
                    }

                } catch (error) {
                    console.log(error)
                }

            } else {
                console.log("error")
            }
            this.cancelLoading = false
        },
        setFallbackData() {
            this.parkingSpotsWaiting = [
                { titre: 'Place Centrale', image: 'image.png', note: 4.2, distance: 100, prix: 10, state: 'Confirmed' },
                { titre: 'Parking Rive Gauche', image: 'image.png', note: 4.5, distance: 50, prix: 8, state: 'Confirmed' },
                { titre: 'Parking Eco', image: 'image.png', note: 3.8, distance: 75, prix: 7, state: 'Waiting' },
                { titre: 'Titre de lannonce', image: 'image.png', note: 4, distance: 60, prix: 7, state: 'Canceled' }
            ];
            this.parkingSpotsCanceled = [
                { titre: 'Place Centrale', image: 'image.png', note: 4.2, distance: 100, prix: 10, state: 'Confirmed' },
                { titre: 'Parking Rive Gauche', image: 'image.png', note: 4.5, distance: 50, prix: 8, state: 'Confirmed' },
                { titre: 'Parking Eco', image: 'image.png', note: 3.8, distance: 75, prix: 7, state: 'Waiting' },
                { titre: 'Titre de lannonce', image: 'image.png', note: 4, distance: 60, prix: 7, state: 'Canceled' }
            ];
            this.parkingSpotsConfirmed = [
                { titre: 'Place Centrale', image: 'image.png', note: 4.2, distance: 100, prix: 10, state: 'Confirmed' },
                { titre: 'Parking Rive Gauche', image: 'image.png', note: 4.5, distance: 50, prix: 8, state: 'Confirmed' },
                { titre: 'Parking Eco', image: 'image.png', note: 3.8, distance: 75, prix: 7, state: 'Waiting' },
                { titre: 'Titre de lannonce', image: 'image.png', note: 4, distance: 60, prix: 7, state: 'Canceled' }
            ];
        },
    }
}
</script>