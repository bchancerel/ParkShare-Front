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
                <h3>{{ parkingSpots.titre }}</h3>
                <div class="description mb-3">
                  <h5>Description</h5>
                  <p>
                      Lorem ipsum dolor sit amet consectetur adipiscing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum 
                      laborumnumquam blanditiis harum quisquamemnihil commodoris! 
                      Consequuntur voluptatum laborumnumquam blanditiis harum quisquamemnihil commodoris!
                  </p>
                </div>
                <!-- Section Carte -->
                <div class="map-container">
                    <hr>
                    <p><strong> {{ parkingSpots.note }} </strong> ⭐ | {{ parkingSpots.prix }} €/j</p>
                </div>
              </div>
    
            </div>
          </div>
          <!-- Map section -->
          <div class="col-6">
            <GMapMap
              :center="{ lat: 44.8378, lng: -0.5792 }"
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
                :position="marker"></GMapMarker>
            </GMapMap>
          </div>
        </div>
         <!-- Section des commentaires -->
        <hr>
        <div class="comments mt-5">
          <h5>Commentaires</h5>
          <div class="row">
            <div class="col-md-6">
              <div class="card mb-3">
                <div class="card-body">
                  <p><strong>Utilisateur 1</strong></p>
                  <p>Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
                </div>
              </div>
            </div>
    
            <div class="col-md-6">
              <div class="card mb-3">
                <div class="card-body">
                  <p><strong>Utilisateur 2</strong></p>
                  <p>Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
                </div>
              </div>
            </div>
          </div>
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
        apiurl: '',
        marker: {
          lat: 0,
          lng: 0
        },
        reservation: {
          startDate: '',
          startTime: '',
          endDate: '',
          endTime: ''
        }
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
          try {
            const response = await fetch(this.apiurl);
            if (!response.ok) throw new Error('Api call failed')
            const data = await response.json()
            this.parkingSpots = data
            this.marker.lat = this.parkingSpots.lat
            this.marker.lng = this.parkingSpots.long
          } catch (error) {
            console.log(error)
            this.setFallBackData()
          }
        } else {
          this.setFallBackData()
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