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
                        <img src="../assets/static/image.png" class="card-img h-100" :alt="item.name + ' Image'">
                    </div>
                    <div class="col">
                        <div class="card-body">
                            <h5 class="card-title">{{ item.name }}</h5>
                            <p class="card-text">
                                <small class="text-muted">⭐ {{ item.averageRating ? item.averageRating.toFixed(1) : 'N/A' }} | {{ item.hourPrice }} € / h</small>
                            </p>
                            <p class="card-text">
                                {{ item.description }}
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
            apiurl: 'http://localhost:8080/api/ads',
        };
    },
  
    mounted() {
        this.fetchParkingSpots();
    },

    methods: {
        async fetchParkingSpots() {
            if (this.apiurl !== '') {
                try {
                    const token = localStorage.getItem('idToken'); // Récupère le token d'authentification
                    const userId = localStorage.getItem('userId')
                    const response = await fetch(this.apiurl, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`, // Ajoute le token dans les headers
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) throw new Error('API call failed');
                    const data = await response.json();
                    for(let i in data) {
                        if(data[i].userId === userId) {
                            this.parkingSpots.push(data[i])
                        }
                    }

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
                { id: 1, titre: 'Place Centrale', image: 'image.png', note: 4.2, distance: 100, prix: 10 },
                { id: 2, titre: 'Parking Rive Gauche', image: 'image.png', note: 4.5, distance: 50, prix: 8 },
                { id: 3, titre: 'Parking Eco', image: 'image.png', note: 3.8, distance: 75, prix: 7 },
                { id: 4, titre: 'Titre de lannonce', image: 'image.png', note: 4, distance: 60, prix: 7 }
            ];
        },
    },
}
</script>
