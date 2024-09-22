/* global google */
<template>
    <div class="mx-5 my-3">
        <form class="d-flex my-3 px-3 col-4">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
        <div class="dropdown mb-3">
            <button class="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Trier par : {{ selectedSortLabel }}
            </button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click="changeSort('prix', 'Prix')">Prix</a></li>
                <li><a class="dropdown-item" href="#" @click="changeSort('note', 'Note')">Note</a></li>
            </ul>
        </div>
        
        <!-- Bouton Retour -->
        <button v-if="select == true" class="btn btn-outline-warning mb-3" @click="resetView">Retour</button>
        
        <div class="d-flex">
            <!-- Parking spots section -->
            <div class="col-6 overflow-auto mx-3" style="max-height: 700px;">
                <div v-for="(item, index) in sortedParkingSpots" :key="index"  class="card mb-3">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="../assets/static/image.png" class="img-fluid rounded-start" :alt="item.name + ' Image'">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">{{ item.name }}</h5>
                                <p class="card-text"><small class="text-muted">⭐ {{ item.averageRating ? item.averageRating.toFixed(1) : 'N/A' }}</small></p>
                                <p class="card-text">
                                    <span>{{ item.hourPrice }} € / h</span>
                                </p>
                                <a :href="'/annonces/' +  item.id ">
                                    <button class="btn btn-primary">Réserver</button>
                                </a>
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
                        :key="marker.id"
                        v-for="marker in markers"
                        :position="marker.position"
                        @click="selectMarker(marker)"
                    />
                </GMapMap>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    data() {
        return {
            parkingSpots: [],
            visibleParkingSpots: [],
            selectedSort: 'prix',
            selectedSortLabel: 'Prix',
            apiurl: 'http://localhost:8080/api/ads',
            map: null,
            markers: [],
            select: false
        };
    },
    computed: {
        sortedParkingSpots() {
            return [...this.visibleParkingSpots].sort((a, b) => {
                if (this.selectedSort === 'prix') {
                    return a.hourPrice - b.hourPrice;
                } else {
                    return b.note - a.note;
                }
            });
        }
    },
    mounted() {
        this.fetchParkingSpots();
    },
    methods: {
        async fetchParkingSpots() {
            if (this.apiurl !== '') {
                try {
                    const token = localStorage.getItem('idToken'); // Récupère le token d'authentification
                    const response = await fetch(this.apiurl, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`, // Ajoute le token dans les headers
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) throw new Error('API call failed');
                    const data = await response.json();
                    this.parkingSpots = data;

                    this.visibleParkingSpots = this.parkingSpots;
                    this.markers = this.parkingSpots.map(spot => ({
                        id: `marker_${spot.name}`,
                        position: { lat: spot.latitude, lng: spot.longitude }
                    }));
                    this.NoteAd()
                } catch (error) {
                    console.error(error);
                    this.setFallbackData();
                }
            } else {
                this.setFallbackData();
            }
        },
        async NoteAd() {
            for (let spot of this.parkingSpots) {
                try {
                    const token = localStorage.getItem('idToken'); // Récupère le token d'authentification
                    const response = await fetch(`http://localhost:8080/api/feedback/ad/${spot.id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`, // Ajoute le token dans les headers
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) throw new Error('Échec de la récupération des évaluations');
                    const ratings = await response.json();
                    let averageRating = 0; // Note moyenne par défaut
                    if (ratings.length > 0) {
                        averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
                    }
                    spot.averageRating = averageRating;
                } catch (error) {
                    console.error(error);
                    spot.averageRating = 0; // Définissez la note moyenne par défaut en cas d'erreur
                }
            }
        },
        setFallbackData() {
            this.parkingSpots = [

                { id: 1, userId: 'Test', name: "test", description: "test", latitude: 2.01285895, longitude: -2.495629599, state: true, link: "/api/ads/1"}
            ];
            this.visibleParkingSpots = this.parkingSpots;
            this.markers = this.parkingSpots.map(spot => ({
                id: `marker_${spot.name}`,
                position: { lat: spot.latitude, lng: spot.longitude }
            }));
        },
        changeSort(sortKey, sortLabel) {
            this.selectedSort = sortKey;
            this.selectedSortLabel = sortLabel;
        },
        selectMarker(selectedMarker) {
            this.select = true;
            const precision = 0.0001; // Précision pour la comparaison des coordonnées
            this.visibleParkingSpots = this.parkingSpots.filter(spot => {
                return Math.abs(spot.latitude - selectedMarker.position.lat) < precision &&
                    Math.abs(spot.longitude - selectedMarker.position.lng) < precision;
            });
            this.markers = this.markers.filter(marker => marker.id === selectedMarker.id);
            console.log(this.visibleParkingSpots); // Debug pour voir les spots filtrés
        },

        resetView() {
            this.select = false
            this.visibleParkingSpots = this.parkingSpots; // Remet toutes les annonces visibles
            this.markers = this.parkingSpots.map(spot => ({ // Restaure tous les marqueurs
                id: `marker_${spot.name}`,
                position: { lat: spot.latitude, lng: spot.longitude }
            }));
        },
    },
}
</script>


<style scoped>
    .parking-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }
    .parking-item {
      width: 90%;
      border: 1px solid #ccc;
      margin-bottom: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .parking-image {
      width: 100px;
      height: 100px;
      margin-right: 20px;
    }
    .parking-info {
      display: flex;
      flex-direction: column;
    }
    .details {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
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
  