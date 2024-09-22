<template>
    <div class="mx-5 my-5">
        <a :href="'/mes_annonces/' +  parkingSpots.id">
            <div class="back-icon m-3">
            </div>
        </a>
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
                                {{ parkingSpots.description }}
                            </p>
                        </div>
                        <!-- Section Carte -->
                        <div class="map-container">
                            <hr>
                            <p><strong> {{ parkingSpots.rating }} </strong> ⭐ | {{ parkingSpots.hourPrice }} € / h</p>
                        </div>
                    </div>

                    <div v-if="reservations.length > 0" class="col-12 mt-5">
                        <div v-for="reservation in reservations" :key="reservation.id" class="row mb-3">
                            <div class="col-md-2">
                                <i class="fa fa-user-circle fa-2x"></i>
                            </div>
                            <div class="col-md-2">
                                <small>{{ reservation.firstname }} {{ reservation.lastname }}</small>
                            </div>
                            <div class="col-md-6">
                                <small>{{ formatDate(reservation.beginDate) }} to {{ formatDate(reservation.endDate) }}</small>
                                
                            </div>
                            <div class="col-md-2">
                                <small>{{ reservation.totalPrice }} €</small>

                            </div>
                            <div class="col-md-12 d-flex justify-content-around">
                                <div v-if="acceptLoading == true" class="spinner-border text-success" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <button v-else class="btn btn-primary" @click="accept(reservation.id)">Accepter</button>
                                <div v-if="cancelLoading == true" class="spinner-border text-danger" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <button v-else class="btn btn-danger" @click="refuse(reservation.id)">Refuser</button>
                            </div>
                            <div v-if="reservations.length > 1">
                                <hr>
                            </div>
                        </div>
                    </div>
                    <div v-else class="col-12 mt-5">
                        <p>Il n'y a aucune réservation sur cette annonce... Pour le moment.</p>
                    </div>


                </div>
                
            </div>
          <!-- Map section -->
            <div class="col-6">
                <GMapMap
                    :center="marker.position"
                    :zoom="12" 
                    map-type-id="terrain" 
                    style="width: 100%; height: 700px;"
                    :options="{
                        zoomControl: true,
                        mapTypeControl: true,
                        scaleControl: true,
                        streetViewControl: true,
                        rotateControl: true,
                        fullscreenControl: true
                    }"
                    >      
                <GMapMarker
                    :key=parkingSpots.titre
                    :position="marker.position"></GMapMarker>
                </GMapMap>
            </div>
        </div>
    </div>
</template>

<script>
  
export default {
    name: 'ReservComponent',
    
    
    data() {
        return {
            components: 'view',
            parkingSpots: {},
            apiurl: 'http://localhost:8080/api/ads',
            marker: {
                id : "",
                position: {
                    lat: 0,
                    lng: 0
                }
            },
            feedbacks: [],
            reservations: [],
            cancelLoading: false,
            acceptLoading: false
        };
    },
    mounted() {
        this.fetchParkingSpots();
    },
    methods: {
        async fetchParkingSpots() {
            if (this.apiurl !== '') {
                const id = this.$route.params.id;
                try {
                    const token = localStorage.getItem('idToken'); // Récupère le token d'authentification
                    const response = await fetch(this.apiurl + '/' + id, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Ajoute le token dans les headers
                        'Content-Type': 'application/json'
                    }
                    });
                    if (!response.ok) throw new Error('API call failed');
                    const data = await response.json();
                    this.parkingSpots = data;

                    // Vérifier que les valeurs de latitude et longitude sont bien des nombres
                    const lat = parseFloat(this.parkingSpots.latitude);
                    const lng = parseFloat(this.parkingSpots.longitude);

                    
                    // Vérifier si les lat et lng sont valides
                    if (isNaN(lat) || isNaN(lng)) {
                    throw new Error('Invalid latitude or longitude values');
                    }

                    this.marker.id = 'marker_' + this.parkingSpots.name
                    this.marker.position.lat = this.parkingSpots.latitude
                    this.marker.position.lng = this.parkingSpots.longitude
                    this.NoteAd(this.parkingSpots)
                    this.getReservations()
                } catch (error) {
                    console.log("coucou")
                    console.error(error);
                    this.setFallBackData();
                }
            } else {
                this.setFallBackData();
            }
        },
        async NoteAd(item) {
            try {
                const token = localStorage.getItem('idToken')
                const response = await fetch(`http://localhost:8080/api/feedback/ad/${item.id}`, {
                    method: 'GET',
                    headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch ratings');
                const ratings = await response.json();
                this.feedbacks = ratings


                let averageRating = 0; // Default average rating
                if (ratings.length > 0) {
                    averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
                }
                this.parkingSpots.rating = averageRating.toFixed(1); // Store the average rating
                return averageRating; // Return average for potential other uses
            } catch (error) {
                console.error(error);
                this.parkingSpots.rating = 0; // Set default rating on error
                return 0; // Return default rating
            }
        },
        async getReservations() {
            // pour cette fonction :
                // récupe le nom et le prénom des users qui réservent 
                // enlever le reste 
            try {
                const idToken = localStorage.getItem('idToken');

                const url = `http://localhost:8080/api/reservation/ad/${this.parkingSpots.id}`
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${idToken}`, // Ajoute le token dans les headers
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('API call failed');
                const data = await response.json();
                for (let i in data) {
                    if (data[i].statusId == 2) {
                        const url = `http://localhost:8080/api/user/${data[i].userId}`

                        const response = await fetch(url, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${idToken}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        const data2 = await response.json()
                        data[i].firstname = data2.firstname
                        data[i].lastname = data2.lastname
                        this.reservations.push(data[i])
                        
                    }
                }

                
            } catch (error) {
                console.error(error);
                this.setFallbackData();
            }
        },
        setFallBackData() {
            this.parkingSpots = {
                id: 1, 
                titre: 'Place Centrale', 
                image: 'image.png', 
                note: 4.2, 
                distance: 100, 
                prix: 10, 
                lat: 44.8419, 
                long: -0.5705, 
                visible: true 
            }
        
            this.marker.lat = this.parkingSpots.lat
            this.marker.lng = this.parkingSpots.long
        },
        async accept(id) {
            console.log('Accepted:', id);

            this.acceptLoading = true
            try {
                const idToken = localStorage.getItem('idToken');

                const url = `http://localhost:8080/api/reservation/accept/${id}`

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${idToken}`, // Ajoute le token dans les headers
                        'Content-Type': 'application/json'
                    }
                })

                if (response.status == 200) {
                    window.location.reload()
                }

            } catch (error) {
                console.log(error)
            }
            this.acceptLoading = false
        },
        async refuse(id) {
            console.log('Refused:', id);
            
            this.cancelLoading = true
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
                console.log("y")
                if (response.status == 200) {
                    console.log("x")
                    window.location.reload()
                }

            } catch (error) {
                console.log(error)
            }
            this.cancelLoading = false
        },
        formatDate(dateString) {
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // Utilise le format 24h
            };
            return new Date(dateString).toLocaleDateString('fr-FR', options);
        }

    }
}
</script>

<style lang="scss">
  .rating {
    color: #4B774B;
  }
  
  /* Stylise la barre de défilement globale */
  ::-webkit-scrollbar {
      width: 10px; /* Largeur de la scrollbar */ 
  }
  
  /* Stylise la partie track (la piste) de la scrollbar */
  ::-webkit-scrollbar-track {
      background: #f1f1f1; /* Couleur de fond du track */
      border-radius: 10px; /* Bord arrondi pour le track */
  }
  
  /* Stylise la partie thumb (le curseur) de la scrollbar */
  ::-webkit-scrollbar-thumb {
      background: #4B774B; /* Couleur de fond du thumb */
      border-radius: 10px; /* Bord arrondi pour le thumb */
  }
  
  /* Change l'apparence du thumb lors du survol ou du clic */
  ::-webkit-scrollbar-thumb:hover {
      background: #395c39; /* Couleur de fond du thumb lors du survol */
  }

  .back-icon {
    width: 30px;
    height: 30px;
    background: url('../assets/static/arrow.png') no-repeat center center;
    background-size: contain;
  }
  
  </style>