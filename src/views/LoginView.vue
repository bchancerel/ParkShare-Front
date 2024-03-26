<template>
    <div class="login">
        <div id="app">
            <div class="w-100 position-relative">
                <div class="row justify-content-end w-100 h-100">
                    <div class="col-12 col-12 col-md-6 text-center">
                        <div class="container px-0 pt-5 pb-3 p-lg-5 w-75">
                            <h1 class="display-4 mb-5">Bienvenue !</h1>
                            <p class="text-left" style="">Première fois? <a href="/fr/app/signup/">Inscription</a>.</p>
                            <form action="/fr/app/signin/" method="post" class="mb-3" data-bitwarden-watching="1">
                                <input type="hidden" name="csrfmiddlewaretoken" value="mp4EH7HwRfLdntgAhbr0iHjZgInWXF6C4vnpjAz2MsCWRDc0N3SJaPYkRYgnPFyU">
                                <div class="input-group mb-3">
                                    <input type="text" name="username" class="form-control" placeholder="Username" maxlength="150" required="" id="id_username">
                                </div>
                                <div class="input-group mb-3">
                                    <input type="password" name="password" class="form-control" placeholder="Password" required="" id="id_password">
                                </div>
                                <button class="btn btn-primary btn-block col-lg-4" type="submit">Valider</button>
                            </form>
                            <p id="#" class="detail me-3 mb-1" style="position: fixed;bottom: 0;right: 0;">Retourner à l' <a href="/fr" class="detail">Accueil</a>.</p>
                        </div>
                    </div>
                    <div class="d-none d-md-block col-6 p-0 order-first overflow-hidden">
                        <img class="w-100" src="../assets/static/login.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
// @ is an alias to /src
  
export default {
  name: 'LoginView',
  }
</script>
  