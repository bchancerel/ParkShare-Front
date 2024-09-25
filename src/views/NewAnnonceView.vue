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
                    </div>

                    <div class="col-12">
                        <form @submit.prevent="submitForm">
                            <div class="form-group">
                                <label for="title">Titre de l'annonce</label>
                                <input
                                    type="text"
                                    v-model="formData.name"
                                    class="form-control"
                                    id="title"
                                    :placeholder="formData.name"
                                />
                            </div>
                            <div class="description mb-3">
                                <h5>Description</h5>
                                <div class="form-group">
                                    <textarea
                                        v-model="formData.description"
                                        class="form-control"
                                        id="description"
                                        rows="3"
                                        :placeholder="formData.description"
                                    ></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="price">Prix</label>
                                <input type="number"
                                    v-model="formData.hourPrice"
                                    class="form-control"
                                    id="title"
                                    :placeholder="formData.hourPrice">
                            </div>
                            <hr>
                            <div class="form-group">
                                <label for="lat">Latitude</label>
                                <input
                                    type="number" step="0.000001"
                                    v-model="formData.latitude"
                                    class="form-control"
                                    id="lat"
                                    :placeholder="formData.latitude"
                                />
                            </div>
                            <div class="form-group">
                                <label for="long">Longitude</label>
                                <input
                                    type="number" step="0.000001"
                                    v-model="formData.longitude"
                                    class="form-control"
                                    id="long"
                                    :placeholder="formData.longitude"
                                />
                            </div>
                            <div class="form-group my-3">
                                <label for="featured" class="mx-2">Poster en public</label>
                                <input
                                    type="checkbox"
                                    v-model="formData.state"
                                    class="form-check-input"
                                    id="featured"
                                />
                            </div>
                            <div v-if="loading == true" class="spinner-border text-success" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <button v-else-if="loading == false && formData.state == true" type="submit" class="btn btn-success mt-2 mb-3">Poster annonce</button>
                            <button v-else-if="loading == false && formData.state == false" type="submit" class="btn btn-success mt-2 mb-3">Garder en brouillon</button>
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
                        :key="formData.name"
                        :position="{ lat: formData.latitude, lng: formData.longitude }"
                        />
                    </GMapMap>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name : 'NewAnnonce',
    data() {
        return {
            apiurl: "http://localhost:8080/api/ads",
            formData: {
                name: "",
                description: "",
                hourPrice: 0,
                latitude: 0,
                longitude: 0,
                state: true
            },
            loading: false
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
        async submitForm() {
            this.loading = true
            try {
                const idToken = localStorage.getItem('idToken');

                const url = this.apiurl


                // Créer l'objet à envoyer dans le corps de la requête
                const updatedData = {
                    name: this.formData.name,
                    description: this.formData.description,
                    hourPrice: this.formData.hourPrice,
                    latitude: this.formData.latitude,
                    longitude: this.formData.longitude,
                    state: this.formData.state,
                    link: ""
                };
                console.log(updatedData)

                const response = await fetch(url, {
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
                    this.$router.push('/profil')
                }
            } catch (error) {
                console.error('Erreur lors de la soumission du formulaire:', error);
                alert('Une erreur est survenue lors de la soumission du formulaire');
            }
            this.loading = false
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
};
</script>
  
  <style scoped>
  .map-container {
    margin-top: 20px;
  }
  </style>
  