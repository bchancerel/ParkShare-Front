<template>
    <div>
        <div class="mt-5 d-flex justify-content-center tab-container">
            <div class="tab" 
                 :class="{ 'active': activeForm === 'Profile' }"
                 @click="showProfilForm">Profil</div>
            <div class="tab" 
                 :class="{ 'active': activeForm === 'Annonces' }"
                 @click="showAnnonces">Mes annonces</div>
            <div class="tab" 
                 :class="{ 'active': activeForm === 'Reservations' }"
                 @click="showReservations">Mes réservations</div>
        </div>


        <div v-if="activeForm == 'Profile'">
            <ProfilForm />
        </div>
        <div v-else-if="activeForm == 'Annonces'">
            <AnnoncesComposant />
        </div>
        <div v-else-if="activeForm == 'Reservations'">
            <MyReservationComposant />
        </div>
    </div>
</template>

<script>
import ProfilForm from '../components/ProfilForm.vue';
import AnnoncesComposant from '../components/AnnoncesComposant.vue';
import MyReservationComposant from '@/components/MyReservationComposant.vue';

export default {
    name: 'ProfilView',
    components: {
        ProfilForm,
        AnnoncesComposant,
        MyReservationComposant
    },
    data() {
        return {
            activeForm: 'Profile' // Initialize with the profile form active
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
        showProfilForm() {
            this.activeForm = 'Profile';
            console.log(this.activeForm)
        },
        showAnnonces() {
            this.activeForm = 'Annonces';
            console.log(this.activeForm)
        },
        showReservations() {
            this.activeForm = 'Reservations';
            console.log(this.activeForm)
        },
    }
}
</script>


<style lang="scss">
.tab-container {
    background-color: #FEFAF8;
    border-radius: 10px;
    overflow: hidden;
}

.tab {
    padding: 15px;
    cursor: pointer;
    position: relative;
    z-index: 1;
    color: #4B774B;
}

.tab.active {
    color: white;
    background-color: #4B774B;
    border-radius: 10px;

    z-index: 1;
}

.content {
    margin-top: 20px;
    text-align: center;
    font-size: 18px;
}

.tab-container-inverse {
    background-color: #4B774B; /* Fond vert pour le conteneur entier */
    border-radius: 10px;
    overflow: hidden;
}

.tab-inverse {
    padding: 15px;
    cursor: pointer;
    position: relative;
    z-index: 1;
    color: white; /* Texte blanc sur fond vert pour les onglets non-actifs */
    background-color: #4B774B; /* Fond vert pour les onglets non-actifs */
}

.tab-inverse.active-inverse {
    color: #4B774B; /* Texte vert pour l'onglet actif */
    background-color: #D3D3D3; /* Fond gris pour l'onglet actif */
    border-radius: 10px;
    z-index: 1;
}

.content-inverse {
    margin-top: 20px;
    text-align: center;
    font-size: 18px;
    color: #4B774B; /* Couleur du texte ajustée pour le contenu si nécessaire */
}

</style>