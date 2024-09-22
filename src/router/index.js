import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AppView from '../views/AppView.vue'
import ProfileView from '../views/ProfileView.vue'
import AnnonceView from '../views/AnnonceView.vue'
import MesAnnoncesView from '../views/MesAnnoncesView.vue'
import NewAnnonceView from '../views/NewAnnonceView.vue'
import FeedBackView from '../views/FeedBackView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/connexion',
    name: 'connexion', 
    component : LoginView
  },
  {
    path: '/app',
    name: 'app',
    component: AppView,
    meta: { requiresAuth: true } // Indique que cette route nécessite une authentification
  },
  {
    path : '/profil',
    name : 'profil',
    component: ProfileView,
    meta: { requiresAuth: true } // Indique que cette route nécessite une authentification
  },
  {
    path: '/annonces/:id',
    name: 'AnnonceDetail',
    component: AnnonceView,
    meta: { requiresAuth: true } // Indique que cette route nécessite une authentification
  },
  {
    path: '/mes_annonces/:id',
    name: 'MesAnnonces',
    component: MesAnnoncesView,
    meta: { requiresAuth: true } // Indique que cette route nécessite une authentification
  },
  {
    path: '/new',
    name: 'NewAnnonce',
    component: NewAnnonceView,
    meta: { requiresAuth: true } // Indique que cette route nécessite une authentification
  },
  {
    path: '/feedback/:id',
    name: 'Feedback',
    component: FeedBackView,
    meta: { requiresAuth: true } // Indique que cette route nécessite une authentification
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router
