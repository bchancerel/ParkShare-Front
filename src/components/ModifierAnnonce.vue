<template>
    <div class="mx-5 my-5">
        <a :href="'/mes_annonces/' +  parkingSpot.id">
            <div class="back-icon m-3">
            </div>
        </a>
        <div class="d-flex mb-5">
            <div class="col-6 overflow-auto px-3">
                <div class="row">

                    <div class="col-12 mt-4">
                        <form @submit.prevent="submitForm">
                            <div class="form-group">
                                <label for="title">Titre de l'annonce</label>
                                <input
                                    type="text"
                                    v-model="parkingSpot.name"
                                    class="form-control"
                                    id="title"
                                    :placeholder="parkingSpot.name"
                                />
                            </div>
                            <div class="description mb-3">
                                <label>Description</label>
                                <div class="form-group">
                                    <textarea
                                        v-model="parkingSpot.description"
                                        class="form-control"
                                        id="description"
                                        rows="3"
                                        :placeholder="parkingSpot.description"
                                    ></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="price">Prix</label>
                                <input type="number"
                                    step="0.01"
                                    v-model="parkingSpot.hourPrice"
                                    class="form-control"
                                    id="title"
                                    :placeholder="parkingSpot.hourPrice">
                            </div>
                            <div class="form-group">
                                <label for="lat">Latitude</label>
                                <input
                                    type="number"
                                    step="0.000001"
                                    v-model="parkingSpot.latitude"
                                    class="form-control"
                                    id="lat"
                                    :placeholder="parkingSpot.latitude"
                                />
                            </div>
                            <div class="form-group">
                                <label for="long">Longitude</label>
                                <input
                                    type="number"
                                    step="0.000001"
                                    v-model="parkingSpot.longitude"
                                    class="form-control"
                                    id="long"
                                    :placeholder="parkingSpot.longitude"
                                />
                            </div>
                            <div class="form-group my-3">
                                <label for="featured" class="mx-2">Poster en public</label>
                                <input
                                    type="checkbox"
                                    v-model="parkingSpot.state"
                                    class="form-check-input"
                                    id="featured"
                                />
                            </div>
                            <button v-if="parkingSpot.state == true" type="submit" class="btn btn-success mt-2 mb-3">Mettre à jour l'annonce</button>
                            <button v-else type="submit" class="btn btn-success mt-2 mb-3">Garder en brouillon</button>
                        </form>
                    </div>

                </div>
            </div>
            <div class="col-6">
                <!-- Carte avec la position -->
                <div class="map-container mt-4">
                    <h5>Localisation sur la carte</h5>
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
                        :key="parkingSpot.titre"
                        :position="{ lat: parkingSpot.latitude, lng: parkingSpot.longitude }"
                        />
                    </GMapMap>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name : 'ModifierAnnonce',
    data() {
        return {
            parkingSpot: {
                id: null,
                name: "",
                description: "",
                hourPrice: 0,
                latitude: 0,
                longitude: 0,
                state: true
            },
            apiurl: 'http://localhost:8080/api/ads/',
            marker: {
                id : "",
                position: {
                    lat: 0,
                    lng: 0
                }
            },
        };
    },
    methods: {
        async fetchParkingSpots() {
            try {
                const id = this.$route.params.id;
                console.log(id)
                const token = localStorage.getItem('idToken'); // Récupère le token d'authentification
                const response = await fetch('http://localhost:8080/api/ads/' + id, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Ajoute le token dans les headers
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('API call failed');
                const data = await response.json();
                this.parkingSpot = data;

                const lat = parseFloat(this.parkingSpot.latitude);
                const lng = parseFloat(this.parkingSpot.longitude);

                
                // Vérifier si les lat et lng sont valides
                if (isNaN(lat) || isNaN(lng)) {
                    throw new Error('Invalid latitude or longitude values');
                }

                this.marker.id = 'marker_' + this.parkingSpot.name
                this.marker.position.lat = this.parkingSpot.latitude
                this.marker.position.lng = this.parkingSpot.longitude
            } catch (error) {
                console.log("coucou")
                console.error(error);
                this.setFallBackData();
            }
        },
        async submitForm() {
            this.loading = true
            try {
                const id = this.$route.params.id
                const idToken = localStorage.getItem('idToken');

                const url = this.apiurl + id


                // Créer l'objet à envoyer dans le corps de la requête
                const updatedData = {
                    name: this.parkingSpot.name,
                    description: this.parkingSpot.description,
                    hourPrice: this.parkingSpot.hourPrice,
                    latitude: this.parkingSpot.latitude,
                    longitude: this.parkingSpot.longitude,
                    state: this.parkingSpot.state,
                    link: ""
                };
                console.log(updatedData)

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
                    window.location.reload()
                }
            } catch (error) {
                console.error('Erreur lors de la soumission du formulaire:', error);
                alert('Une erreur est survenue lors de la soumission du formulaire');
            }
            this.loading = false
        },
        setFallBackData() {
            this.parkingSpot = {
                id: 1,
                titre: "Place Centrale",
                description: "Une belle place au centre de la ville.",
                images : [
                    { src: '../assets/static/image.png' },
                    { src: '../assets/static/image.png' },
                    { src: '../assets/static/image.png' }
                ],
                note: 4.6,
                prix: 10,
                lat: 48.8566,
                long: 2.3522,
                visible: true,
            };
        },
    },
    mounted() {
        this.fetchParkingSpots()
    },
};
</script>
  
  <style scoped>
  .map-container {
    margin-top: 20px;
  }
  </style>
  