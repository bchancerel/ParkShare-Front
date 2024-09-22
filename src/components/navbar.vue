<template>
    <div v-if="!isSpecificPage">
        <nav class="navbar navbar-light bg-light">
            <div class="container-fluid">
                <h1 class="reverse">ParkShare</h1>
                <div class="d-flex">
                    <a href="/profil">
                        <div class="user-icon mx-2">
                        </div>
                    </a>
                    <div @click="diconnect()" class="user-disconnect mx-2">
                    </div>
                </div>
            </div>
        </nav>
    </div>
    <div v-else>
        <div class="navbar">
            <h1>ParkShare</h1>
            <div class="d-flex">
                <a href="/app">
                    <div class="home-icon mx-2">
                    </div>
                </a>
                <div @click="diconnect()" class="user-disconnect mx-2"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'NavBar',
        data() {
            return {
                forbiddenPages: ['/profil', '/mes_annonces/', '/new', '/feedback/'],
            }
        },
        computed: {
            isSpecificPage() {
                return this.forbiddenPages.some(page => this.$route.path.startsWith(page));
            }
        },
        methods : {
            diconnect() {
                // Supprimer le idToken du localStorage
                localStorage.removeItem('idToken');
                localStorage.removeItem('userId')
                
                // Rediriger vers la page de connexion
                this.$router.push('/connexion');
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.navbar {
    background-color: #4B774B;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar h1 {
    color: white;
    margin: 0;
    font-size: 34px;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;

}

.navbar .reverse {
    color: #4B774B;
    margin: 0;
    font-size: 34px;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.navbar .home-icon {
    width: 30px;
    height: 30px;
    background: url('../assets/static/home.png') no-repeat center center;
    background-size: contain;
}

.navbar .user-icon {
    width: 30px;
    height: 30px;
    background: url('../assets/static/user.png') no-repeat center center;
    background-size: contain;
}

.navbar .user-disconnect {
    width: 30px;
    height: 30px;
    background: url('../assets/static/turn_off.png') no-repeat center center;
    background-size: contain;
}

.profile-settings {
    color: lightgray;
    font-size: 14px;
    position: absolute;
    top: 10px;
    left: 10px;
}
</style>
  