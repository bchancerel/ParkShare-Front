<template>
  <div v-if="!isSpecificPage">
    <NavBar/>
  </div>
  <router-view/>
</template>

<script>
import NavBar from '@/components/navbar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  },
  data() {
    return {
      forbiddenPages : ['/login', '/register'],
    };
  },
  computed: {
    isSpecificPage() {
      return this.forbiddenPages.includes(this.$route.path)
    }
  }
}
</script>

<style lang="scss">
$primary: #39743F;
$secondary: #09003E;
$grey: #D0D0D0;
$dark-grey: #6B6B6B;
$white: #FEFAF8;
$danger: #9C3434;

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: $white;

  .btn-primary {
    background-color: $primary;
    box-shadow: 0 4px 9px -4px $primary;
  }

  a {
    color: $secondary;
  }
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
