<template>
    <a href="/profil">
        <div class="back-icon m-3">
        </div>
    </a>
    <div class="mx-5 my-5">
        <div class="d-flex mb-5">
            <div class="col-6 overflow-auto px-3">
                <div class="row">
    
                    <div class="col-12">
                        <h5>Ajouter des images (maximum 3)</h5>
                        <input type="file" name="photo" accept="image/*" @change="setPhotoFiles($event.target.name, $event.target.files)" />
                        <div class="images-preview mt-2">
                            <div v-for="(image, index) in parkingSpot.images" :key="index" class="image-container mx-2">
                                <p>{{image}}</p>
                                <button class="btn btn-danger btn-sm" @click="removeImage(index)">Supprimer</button>
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
    name : 'NewAnnonce',
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
        updateCoordinates() {
            if (this.newLat && this.newLong) {
                this.parkingSpot.lat = this.newLat;
                this.parkingSpot.long = this.newLong;
            } else {
                alert("Veuillez entrer des coordonnées valides.");
            }
        },
        handleFileUpload(event) {
            const files = Array.from(event.target.files);
            if (this.parkingSpot.images.length + files.length > 3) {
                alert("Vous ne pouvez pas ajouter plus de 3 images.");
                return;
            }
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.parkingSpot.images.push({ url: e.target.result });
                };
                reader.readAsDataURL(file);
            });
        },
        removeImage(index) {
            this.parkingSpot.images.splice(index, 1);
        },
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
  