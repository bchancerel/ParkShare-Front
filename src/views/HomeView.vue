<template>
  <div class="home">
    <header>
      <div class="title py-5 d-block">
      <h1 class="park police">
        ParkShare
      </h1>
      <span class="slogan">
        "ParkShare: Simplifiez votre stationnement, partagez votre espace."
      </span>
    </div>
    <img src="../assets/logo.png" class="w-25 nuit" alt="nuit">
    </header>
    <div class="container mb-5">
      <div class="card p-2">
          <section id="features">
              <h2>Bienvenue !</h2>
              <p>Bienvenue sur ParkShare ! Simplifiez votre stationnement dès maintenant avec notre application conviviale. Trouvez et réservez facilement des places de parking adaptées à vos besoins, que ce soit pour un court ou long terme. Profitez d'une solution pratique et sécurisée pour vos déplacements en voiture. Merci de nous rejoindre dans notre mission de rendre le stationnement plus simple et accessible pour tous.</p>
          </section>
          <a  href="/connexion">
            <button class="btn btn-primary">
              Connectez-vous !
            </button>
          </a>
      </div>
    </div>
    <footer>
        <p>&copy; 2024 Échange de Places de Parking. Tous droits réservés.</p>
    </footer>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
}
</script>

<style lang="scss">
$primary: #39743F;
$secondary: #09003E;
$grey: #D0D0D0;
$dark-grey: #6B6B6B;
$white: #FEFAF8;
$danger: #9C3434;

.title{
  text-align: center;
  width: 100%;
  background-color: $primary;
  border-radius: 20px;
}

.title .park .slogan{
  text-transform: uppercase;
  display: block;
}

.park{
  animation: text 2s 1;
  background-color: $primary;
  position: relative;
}

.slogan{
  font-size: 20px;
}

@keyframes text{
  0%{
      color: $primary;
      margin-bottom: -40px;
  }
  50%{
      margin-bottom: -40px;
  }
}
.nuit {
  position: relative;
  margin-top: -30px;
  border-radius: 20px;
}


header {
    color: $white;
    padding: 20px;
    text-align: center;
}
h1 {
    margin-top: 0;
}
.container {
    max-width: 800px;
    margin: 20px auto;
    padding: 0 20px;
}
p {
    font-size: 18px;
    line-height: 1.6;
}
.cta-button {
    display: inline-block;
    background-color: $white;
    color: $primary;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 5px;
    font-size: 18px;
    transition: background-color 0.3s;
}
.cta-button:hover {
    background-color: $secondary;
}
footer {
    background-color: $primary;
    color: $white;
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
}

</style>
