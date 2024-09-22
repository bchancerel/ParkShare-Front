<template>
    <div class="mx-5 px-5 mt-3">
        <div class="d-flex justify-content-center m-5">
            <a href="/new">
                <button class="btn btn-primary">Nouvelle Annonce</button>
            </a>
        </div>
        <div class="row">
            <div v-for="(item, index) in parkingSpots" :key="index" class="card col-12 col-md-6 mb-3">
                <div class="row no-gutters">
                    <div class="col">
                        <img src="../assets/static/image.png" class="card-img h-100" :alt="item.titre + ' Image'">
                    </div>
                    <div class="col">
                        <div class="card-body">
                            <h5 class="card-title">{{ item.titre }}</h5>
                            <p class="card-text">
                                <small class="text-muted">⭐ {{ item.note }}</small>
                            </p>
                            <p class="card-text">
                                <span>{{ item.distance }}m away</span> | 
                                <span>{{ item.prix }} €</span>
                            </p>
                            <a :href="'/mes_annonces/' +  item.id ">
                                <button class="btn btn-primary">Voir</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            parkingSpots: [],
            apiurl: ''
        };
    },
  
    mounted() {
        this.fetchParkingSpots();
    },

    methods: {
        async fetchParkingSpots() {
            if (this.apiurl != '') {
                try {
                    const response = await fetch(this.apiurl);
                    if (!response.ok) throw new Error('API call failed');
                    const data = await response.json();
                    this.parkingSpots = data;
                } catch (error) {
                    console.error(error);
                    this.setFallbackData();
                }
            } else {
                this.setFallbackData();
            }
        },
        setFallbackData() {
            this.parkingSpots = [
                { id: 1, titre: 'Place Centrale', image: 'image.png', note: 4.2, distance: 100, prix: 10 },
                { id: 2, titre: 'Parking Rive Gauche', image: 'image.png', note: 4.5, distance: 50, prix: 8 },
                { id: 3, titre: 'Parking Eco', image: 'image.png', note: 3.8, distance: 75, prix: 7 },
                { id: 4, titre: 'Titre de lannonce', image: 'image.png', note: 4, distance: 60, prix: 7 }
            ];
        },
    },
}
</script>
