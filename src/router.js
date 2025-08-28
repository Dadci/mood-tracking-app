import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './store/authStore.js'

import HomeView from './pages/HomeView.vue'
import SignInView from './pages/SignInView.vue'
import LogInView from './pages/LogInView.vue'
import OnboardingView from './pages/OnboardingView.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
        meta: { requiresAuth: true, requiresOnboarding: true }
    },
    {
        path: '/signin',
        name: 'SignIn',
        component: SignInView,
        meta: { requiresGuest: true }
    },
    {
        path: '/login',
        name: 'LogIn',
        component: LogInView,
        meta: { requiresGuest: true }
    },
    {
        path: '/onboarding',
        name: 'Onboarding',
        component: OnboardingView,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    // Routes that require authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/signin')
        return
    }

    // Routes that require completed onboarding
    if (to.meta.requiresOnboarding && authStore.isAuthenticated && !authStore.hasCompletedOnboarding) {
        next('/onboarding')
        return
    }

    // Routes that require guest (not authenticated)
    if (to.meta.requiresGuest && authStore.isAuthenticated) {
        if (authStore.hasCompletedOnboarding) {
            next('/')
        } else {
            next('/onboarding')
        }
        return
    }

    next()
})

export default router