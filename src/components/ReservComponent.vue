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

                    <div class="col-12 mt-5">
                        <div v-for="person in people" :key="person.id" class="row mb-3">
                            <div class="col-md-2">
                                <i class="fa fa-user-circle fa-2x"></i>
                            </div>
                            <div class="col-md-6">
                                <p>{{ person.name }}</p>
                                <p>{{ person.date }}</p>
                            </div>
                            <div class="col-md-4">
                                <button class="btn btn-primary" @click="accept(person.id)">Accepter</button>
                                <button class="btn btn-danger" @click="refuse(person.id)">Refuser</button>
                            </div>
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
    </div>
</template>

<script>
  
export default {
    name: 'ReservComponent',
    
    
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
            },
            people: [
                { id: 1, name: 'Nom Prénom', date: 'Date début - Date fin' },
                { id: 2, name: 'Nom Prénom', date: 'Date début - Date fin' },
                { id: 3, name: 'Nom Prénom', date: 'Date début - Date fin' }
            ]
        };
    },
    mounted() {
        this.fetchParkingSpots();
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
        accept(id) {
            console.log('Accepted:', id);
            // Additional logic for accepting
        },
        refuse(id) {
            console.log('Refused:', id);
            // Additional logic for refusing
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