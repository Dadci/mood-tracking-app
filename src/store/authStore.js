import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref(null)
    const isAuthenticated = ref(false)
    const hasCompletedOnboarding = ref(false)

    // Computed
    const userEmail = computed(() => user.value?.email || '')
    const userName = computed(() => user.value?.name || '')
    const userAvatar = computed(() => user.value?.avatar || '')

    // Actions
    const signUp = async (email, password) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Create user account
            const newUser = {
                id: Date.now(),
                email,
                password, // In real app, this would be hashed
                createdAt: new Date().toISOString()
            }

            // Store in localStorage (simulate database)
            const users = JSON.parse(localStorage.getItem('users') || '[]')

            // Check if user already exists
            if (users.find(u => u.email === email)) {
                throw new Error('User already exists')
            }

            users.push(newUser)
            localStorage.setItem('users', JSON.stringify(users))

            // Set current user
            user.value = newUser
            isAuthenticated.value = true
            hasCompletedOnboarding.value = false

            saveAuthState()

            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const login = async (email, password) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            const users = JSON.parse(localStorage.getItem('users') || '[]')
            const foundUser = users.find(u => u.email === email && u.password === password)

            if (!foundUser) {
                throw new Error('Invalid email or password')
            }

            user.value = foundUser
            isAuthenticated.value = true
            hasCompletedOnboarding.value = !!foundUser.name // Check if onboarding completed

            saveAuthState()

            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const completeOnboarding = (name, profilePicture) => {
        if (!user.value) return

        // Update user with onboarding data
        user.value.name = name
        user.value.avatar = profilePicture
        hasCompletedOnboarding.value = true

        // Update in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const userIndex = users.findIndex(u => u.id === user.value.id)
        if (userIndex !== -1) {
            users[userIndex] = user.value
            localStorage.setItem('users', JSON.stringify(users))
        }

        saveAuthState()
    }

    const updateProfile = (name, profilePicture) => {
        if (!user.value) return

        // Update user with new data
        user.value.name = name
        if (profilePicture) {
            user.value.avatar = profilePicture
        }

        // Update in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const userIndex = users.findIndex(u => u.id === user.value.id)
        if (userIndex !== -1) {
            users[userIndex] = user.value
            localStorage.setItem('users', JSON.stringify(users))
        }

        saveAuthState()
    }

    const logout = () => {
        user.value = null
        isAuthenticated.value = false
        hasCompletedOnboarding.value = false

        localStorage.removeItem('authState')
    }

    const saveAuthState = () => {
        const authState = {
            user: user.value,
            isAuthenticated: isAuthenticated.value,
            hasCompletedOnboarding: hasCompletedOnboarding.value
        }
        localStorage.setItem('authState', JSON.stringify(authState))
    }

    const loadAuthState = () => {
        const saved = localStorage.getItem('authState')
        if (saved) {
            const authState = JSON.parse(saved)
            user.value = authState.user
            isAuthenticated.value = authState.isAuthenticated
            hasCompletedOnboarding.value = authState.hasCompletedOnboarding
        }
    }

    // Load auth state on store initialization
    loadAuthState()

    return {
        // State
        user,
        isAuthenticated,
        hasCompletedOnboarding,

        // Computed
        userEmail,
        userName,
        userAvatar,

        // Actions
        signUp,
        login,
        completeOnboarding,
        updateProfile,
        logout,
        loadAuthState
    }
})