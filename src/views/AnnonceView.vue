<template>
  <a href="/app">
    <div class="back-icon m-3"></div>
  </a>
  <div class="mx-5 my-5">
    <div class="d-flex mb-5">
      <div class="col-6 overflow-auto px-3">
        <div class="row">
          <div class="col-md-6">
            <div class="row">
              <div class="col-12">
                <img
                  src="../assets/static/image.png"
                  class="img-fluid"
                  alt=""
                />
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-6">
                <img
                  src="../assets/static/image.png"
                  class="img-fluid"
                  alt=""
                />
              </div>
              <div class="col-6">
                <img
                  src="../assets/static/image.png"
                  class="img-fluid"
                  alt=""
                />
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <h3>{{ parkingSpots.name }}</h3>
            <div class="description mb-3">
              <h5>Description</h5>
              <p>
                {{ parkingSpots.description }}
              </p>
            </div>
            <!-- Section Carte -->
            <div class="map-container">
              <hr />
              <p>
                <strong> {{ parkingSpots.rating }} </strong> ⭐ |
                {{ parkingSpots.hourPrice }} €/j
              </p>
              <p>
                By : <strong> {{ user.firstname }} {{ user.lastname }} </strong>
              </p>
            </div>
          </div>
        </div>
        <form @submit.prevent="submitReservation" class="row g-3">
          <div class="col-md-6">
            <label for="startDate" class="form-label">Date de début</label>
            <input
              type="date"
              class="form-control"
              id="startDate"
              v-model="reservation.startDate"
              required
            />
          </div>
          <div class="col-md-6">
            <label for="startTime" class="form-label">Heure de début</label>
            <input
              type="time"
              class="form-control"
              id="startTime"
              v-model="reservation.startTime"
              required
            />
          </div>
          <div class="col-md-6">
            <label for="endDate" class="form-label">Date de fin</label>
            <input
              type="date"
              class="form-control"
              id="endDate"
              v-model="reservation.endDate"
              required
            />
          </div>
          <div class="col-md-6">
            <label for="endTime" class="form-label">Heure de fin</label>
            <input
              type="time"
              class="form-control"
              id="endTime"
              v-model="reservation.endTime"
              required
            />
          </div>
          <div class="col-12">
            <div
              v-if="loading == true"
              class="spinner-border text-success"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <button v-else type="submit" class="btn btn-primary">
              Réserver
            </button>
            <div
              v-if="logMessage.length > 0"
              class="alert alert-success"
              role="alert"
            >
              {{ logMessage }}
            </div>
          </div>
        </form>
      </div>
      <!-- Map section -->
      <div class="col-6">
        <GMapMap
          :center="marker.position"
          :zoom="12"
          map-type-id="terrain"
          style="width: 100%; height: 700px"
          :options="{
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: true,
            rotateControl: true,
            fullscreenControl: true,
          }"
        >
          <GMapMarker
            :key="parkingSpots.titre"
            :position="marker.position"
          ></GMapMarker>
        </GMapMap>
      </div>
    </div>
    <!-- Section des commentaires -->
    <hr />
    <div class="comments mt-5">
      <h3>Commentaires</h3>
      <div v-if="feedbacks.length < 0" class="row">
        <div v-for="(item, index) in feedbacks" :key="index" class="col-md-6">
          <div class="card mb-3">
            <div class="card-body">
              <p>
                <strong>{{ item.firstname }} {{ item.lastname }}</strong>
              </p>
              <p>{{ item.description }}</p>
              <p>{{ item.rating }} ⭐</p>
              <p>
                écrit le : <strong>{{ formatDate(item.date) }}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
      <p>Il n'y aucun commentaire pour cette</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnnonceView",

  data() {
    return {
      parkingSpots: {},
      apiurl: "http://localhost:8080/api/ads",
      marker: {
        id: "",
        position: {
          lat: 0,
          lng: 0,
        },
      },
      reservation: {
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
      },
      user: {
        firstname: "",
        lastname: "",
      },
      feedbacks: [],
      loading: false,
      logMessage: "",
    };
  },
  mounted() {
    this.fetchParkingSpots();
  },
  beforeCreate() {
    const idToken = localStorage.getItem("idToken");
    console.log(idToken);
    if (!idToken) {
      console.warn(
        "idToken is missing in localStorage. Redirecting to login..."
      );
      // Redirection vers la page de connexion ou une autre action à définir
      window.location.href = "/connexion"; // Redirection après succès
    }
  },
  methods: {
    async fetchParkingSpots() {
      if (this.apiurl !== "") {
        const id = this.$route.params.id;
        try {
          const token = localStorage.getItem("idToken"); // Récupère le token d'authentification
          const response = await fetch(this.apiurl + "/" + id, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Ajoute le token dans les headers
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) throw new Error("API call failed");
          const data = await response.json();
          this.parkingSpots = data;

          // Vérifier que les valeurs de latitude et longitude sont bien des nombres
          const lat = parseFloat(this.parkingSpots.latitude);
          const lng = parseFloat(this.parkingSpots.longitude);

          // Vérifier si les lat et lng sont valides
          if (isNaN(lat) || isNaN(lng)) {
            throw new Error("Invalid latitude or longitude values");
          }

          this.marker.id = "marker_" + this.parkingSpots.name;
          this.marker.position.lat = this.parkingSpots.latitude;
          this.marker.position.lng = this.parkingSpots.longitude;
          this.NoteAd(this.parkingSpots);
          this.getUser(this.parkingSpots.userId);
        } catch (error) {
          console.log("coucou");
          console.error(error);
          this.setFallBackData();
        }
      } else {
        this.setFallBackData();
      }
    },
    async getUser(id) {
      const idToken = localStorage.getItem("idToken");

      const url = `http://localhost:8080/api/user/${id}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);
      this.user.firstname = data.firstname;
      this.user.lastname = data.lastname;
    },
    async NoteAd(item) {
      try {
        const token = localStorage.getItem("idToken"); // Retrieves the authentication token
        const response = await fetch(
          `http://localhost:8080/api/feedback/ad/${item.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Adds the token in the headers
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch ratings");
        const ratings = await response.json();
        this.feedbacks = ratings;

        for (let i in this.feedbacks) {
          const url = `http://localhost:8080/api/user/${this.feedbacks[i].userId}`;

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();
          this.feedbacks[i].firstname = data.firstname;
          this.feedbacks[i].lastname = data.lastname;
        }

        let averageRating = 0; // Default average rating
        if (ratings.length > 0) {
          averageRating =
            ratings.reduce((acc, curr) => acc + curr.rating, 0) /
            ratings.length;
        }
        this.parkingSpots.rating = averageRating.toFixed(1); // Store the average rating
        return averageRating; // Return average for potential other uses
      } catch (error) {
        console.error(error);
        this.parkingSpots.rating = 0; // Set default rating on error
        return 0; // Return default rating
      }
    },
    setFallBackData() {
      this.parkingSpots = {
        id: 1,
        titre: "Place Centrale",
        image: "image.png",
        note: 4.2,
        distance: 100,
        prix: 10,
        lat: 44.8419,
        long: -0.5705,
        visible: true,
      };

      this.marker.lat = this.parkingSpots.lat;
      this.marker.lng = this.parkingSpots.long;
    },
    async submitReservation() {
      this.loading = true;

      console.log(this.reservation);

      const beginDate = new Date(
        this.reservation.startDate + "T" + this.reservation.startTime
      );
      const endDate = new Date(
        this.reservation.endDate + "T" + this.reservation.endTime
      );

      beginDate.setHours(beginDate.getHours() + 2);
      endDate.setHours(endDate.getHours() + 2);

      const beginDateISO = beginDate.toISOString();
      const endDateISO = endDate.toISOString();

      const finalbeginDate = beginDateISO.slice(0, -5);
      const finalendDate = endDateISO.slice(0, -5);

      try {
        const idToken = localStorage.getItem("idToken");

        const url = "http://localhost:8080/api/reservation";

        const updatedData = {
          statusId: 2,
          beginDate: finalbeginDate,
          endDate: finalendDate,
          adId: this.parkingSpots.id,
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`, // Ajoute le token dans les headers
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        console.log(response);
        if (response.status == 201) {
          console.log("success");
          this.logMessage = "Réservation effecuté avec succès";
        }
      } catch (error) {
        console.error("Erreur lors de la soumission du formulaire:", error);
        alert("Une erreur est survenue lors de la soumission du formulaire");
      }
      this.loading = false;
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("fr-FR", options);
    },
  },
};
</script>

<style lang="scss">
.rating {
  color: #4b774b;
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
  background: #4b774b; /* Couleur de fond du thumb */
  border-radius: 10px; /* Bord arrondi pour le thumb */
}

/* Change l'apparence du thumb lors du survol ou du clic */
::-webkit-scrollbar-thumb:hover {
  background: #395c39; /* Couleur de fond du thumb lors du survol */
}
</style>
