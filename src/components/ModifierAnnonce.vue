<template>
    <div class="mx-5 my-5">
        <div class="d-flex mb-5">
            <div class="col-6 overflow-auto px-3">
                <div class="row">
    
                    <div class="col-12">
                        <div class="row">
                            <!-- Première image -->
                            <div class="col-6 mt-4" v-for="(image, index) in parkingSpot.images" :key="index">
                                <img :src="image.src" class="img-fluid" alt="">
                                <div class="mt-2">
                                    <button class="btn btn-danger btn-sm" @click="deleteImage(index)">Supprimer</button>
                                    <button class="btn btn-primary btn-sm" @click="editImage(index)">Modifier</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="form-group">
                            <label for="title">Titre de l'annonce</label>
                            <input
                                type="text"
                                v-model="parkingSpot.titre"
                                class="form-control"
                                id="title"
                                :placeholder="parkingSpot.titre"
                            />
                        </div>
                        <div class="description mb-3">
                            <h5>Description</h5>
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
                                v-model="parkingSpot.prix"
                                class="form-control"
                                id="title"
                                :placeholder="parkingSpot.prix">
                        </div>
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
                        :position="{ lat: parkingSpot.lat, lng: parkingSpot.long }"
                        />
                    </GMapMap>
                </div>
                <!-- Formulaire pour modifier les coordonnées -->
                <div class="form-group">
                    <label for="lat">Latitude</label>
                    <input
                        type="number"
                        v-model="newLat"
                        class="form-control"
                        id="lat"
                        :placeholder="parkingSpot.long"
                    />
                </div>
                <div class="form-group">
                    <label for="long">Longitude</label>
                    <input
                        type="number"
                        v-model="newLong"
                        class="form-control"
                        id="long"
                        :placeholder="parkingSpot.lat"
                    />
                </div>
                <button class="btn btn-primary my-3" @click="updateCoordinates">
                    Mettre à jour les coordonnées
                </button>
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
                titre: "",
                description: "",
                images: [],
                note: 0,
                prix: 0,
                lat: 0,
                long: 0,
                visible: true,
            },
            newLat: null,
            newLong: null,
            uploadedImage: null,
        };
    },
    methods: {
        fetchParkingSpot(apiUrl) {
            if (apiUrl) {
                // Appel API si l'url est fournie
                fetch(apiUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        this.parkingSpot = data;
                    })
                    .catch((error) => console.error("Erreur lors de l'appel API:", error));
            } else {
                // Utiliser des données fictives si l'API n'est pas disponible
                this.loadFakeData();
            }
        },
        loadFakeData() {
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
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.uploadedImage = URL.createObjectURL(file);
        },
        updateCoordinates() {
            if (this.newLat && this.newLong) {
                this.parkingSpot.lat = this.newLat;
                this.parkingSpot.long = this.newLong;
            } else {
                alert("Veuillez entrer des coordonnées valides.");
            }
        },
        deleteImage(index) {
            // Supprime l'image à l'index donné
            this.images.splice(index, 1);
        },
        editImage(index) {
            // Modifier l'image (vous pouvez personnaliser cette fonction)
            alert(`Modifier l'image à l'index ${index}`);
        }
    },
    mounted() {
        // Simuler l'appel API ou charger des données fictives
        this.fetchParkingSpot(null); // Passez l'URL de l'API ici si disponible
    },
};
</script>
  
  <style scoped>
  .map-container {
    margin-top: 20px;
  }
  </style>
  