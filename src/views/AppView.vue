<template>
    <div id="app">
      <ParkingList />
    </div>
  </template>
  
  <script>
  import ParkingList from '../components/ParkingList.vue';
  
  export default {
    name: 'App',
    components: {
      ParkingList,
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
  };
  </script>
  
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  </style>
  