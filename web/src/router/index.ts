import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VerificationView from '../views/VerificationView.vue'
import SearchResultsView from '../views/SearchResultsView.vue'
import ContentDetailsView from '../views/ContentDetailsView.vue'
import ContributeView from '../views/ContributeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/verification',
            name: 'verification',
            component: VerificationView
        },
        {
            path: '/search',
            name: 'search',
            component: SearchResultsView
        },
        {
            path: '/content/:id',
            name: 'content-details',
            component: ContentDetailsView
        },
        {
            path: '/contribute',
            name: 'contribute',
            component: ContributeView
        }
    ]
})

export default router 