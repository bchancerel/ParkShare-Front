<template>
    <a href="/profil">
      <div class="back-icon m-3">
      </div>
    </a>
    <div v-if="components == 'reservations'">
       <ReservComponent/>
    </div>
    <div v-else-if="components == 'modif'">
      <ModifierAnnonce/>
    </div>
    <div v-else-if="components == 'view'">
      <div class="container my-5">
          <div class="d-flex justify-content-center">
              <button @click="componentsModif()" class="btn btn-primary mx-5">Modifier</button>
              <button @click="componentsReservations()" class="btn btn-primary mx-5">Réservations</button>
          </div>
      </div>
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
                      {{ parkingSpots.description }}
                  </p>
                </div>
                <!-- Section Carte -->
                <div class="map-container">
                    <hr>
                    <p><strong> {{ parkingSpots.rating }} </strong> ⭐ | {{ parkingSpots.hourPrice }} € / h</p>
                    <small v-if="parkingSpots.state == false">L'annonce est un brouillon, elle n'est pas en public</small>
                </div>
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
         <!-- Section des commentaires -->
        <hr>
        <div class="comments mt-5">
          <h3>Commentaires</h3>
          <div v-if="feedbacks.length < 0" class="row">
            <div v-for="(item, index) in feedbacks" :key="index" class="col-md-6">
              <div class="card mb-3">
                <div class="card-body">
                  <p><strong>{{ item.firstname }} {{ item.lastname }}</strong></p>
                  <p>{{ item.description }}</p>
                  <p>{{ item.rating }} ⭐</p>
                  <p>écrit le : <strong>{{ formatDate(item.date) }}</strong></p>
                </div>
              </div>
            </div>
          </div>
          <p>Il n'y aucun commentaire pour cette </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ModifierAnnonce from '../components/ModifierAnnonce.vue'
  import ReservComponent from '../components/ReservComponent.vue'
  
  export default {
    name: 'AnnonceView',
    components: {
        ModifierAnnonce,
        ReservComponent
    },
    
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
        feedbacks: []
      };
    },
    mounted() {
      this.fetchParkingSpots();
    },
    beforeCreate() {
        const idToken = localStorage.getItem('idToken');
        console.log(idToken)
        if (!idToken) {
            console.warn('idToken is missing in localStorage. Redirecting to login...');
            // Redirection vers la page de connexion ou une autre action à définir
            window.location.href = '/connexion';  // Redirection après succès
        }
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
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
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
      componentsReservations() {
        this.components = 'reservations'
      },
      componentsModif() {
        this.components = 'modif'
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
  
  </style>