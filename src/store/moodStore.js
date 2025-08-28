import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMoodStore = defineStore('mood', () => {
  // State
  const moodEntries = ref([])
  const moodQuotes = ref({
    "-2": [
      "You are stronger than you think; the storm will pass.",
      "It's okay to cry. Healing begins when you let your feelings flow.",
      "Even in darkness, a spark of hope can shine bright.",
      "This moment is tough, but you've overcome challenges before.",
      "A gentle step forward, no matter how small, is still progress."
    ],
    "-1": [
      "Pain is temporary, brighter days lie ahead.",
      "Each setback is a chance to grow and learn.",
      "One small positive thought can change your entire day.",
      "It's okay to rest; self-care isn't selfish.",
      "Healing takes time - be patient and kind to yourself."
    ],
    "0": [
      "A calm mind can find opportunity in every moment.",
      "Sometimes the greatest triumph is simply finding peace.",
      "Take a moment to breathe; every breath is a fresh start.",
      "Even an ordinary day can hold a pleasant surprise.",
      "Balance isn't found, it's created."
    ],
    "1": [
      "Happiness grows when it's shared with others.",
      "Celebrate even the small victories to make life extraordinary.",
      "Gratitude can turn what you have into enough.",
      "Keep smiling; your joy can be contagious.",
      "Where focus goes, energy flows - keep your focus on what lifts you."
    ],
    "2": [
      "When your heart is full, share your light with the world.",
      "Savor the highs in life; they become precious memories.",
      "Joy multiplies when spread among friends.",
      "Trust your journey; you're in a beautiful place right now.",
      "Let your happiness ripple out and inspire others."
    ]
  })

  // Helper function to convert mood value to number
  const convertMoodToNumber = (moodValue) => {
    const moodMap = {
      'very-sad': -2,
      'sad': -1,
      'neutral': 0,
      'happy': 1,
      'very-happy': 2
    }
    return moodMap[moodValue] || 0
  }

  // Helper function to convert sleep hours to number
  const convertSleepToNumber = (sleepValue) => {
    const sleepMap = {
      '0-2': 1,
      '3-4': 3.5,
      '5-6': 5.5,
      '7-8': 7.5,
      '9-plus': 9
    }
    return sleepMap[sleepValue] || 0
  }

  // Computed properties
  const todayEntry = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return moodEntries.value.find(entry => {
      const entryDate = new Date(entry.createdAt).toISOString().split('T')[0]
      return entryDate === today
    })
  })

  const hasLoggedToday = computed(() => !!todayEntry.value)

  const last5Entries = computed(() => {
    return moodEntries.value
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  })

  const hasEnoughDataForAverages = computed(() => last5Entries.value.length >= 5)

  const averageMood = computed(() => {
    if (!hasEnoughDataForAverages.value) return null
    
    const total = last5Entries.value.reduce((sum, entry) => sum + entry.mood, 0)
    const avg = total / last5Entries.value.length
    
    // Convert back to mood label
    if (avg >= 1.5) return { value: 2, label: 'Very Happy', color: '#FFC97C' }
    if (avg >= 0.5) return { value: 1, label: 'Happy', color: '#89E780' }
    if (avg >= -0.5) return { value: 0, label: 'Neutral', color: '#89CAFF' }
    if (avg >= -1.5) return { value: -1, label: 'Sad', color: '#B8B1FF' }
    return { value: -2, label: 'Very Sad', color: '#FF9B99' }
  })

  const averageSleep = computed(() => {
    if (!hasEnoughDataForAverages.value) return null
    
    const total = last5Entries.value.reduce((sum, entry) => sum + entry.sleepHours, 0)
    const avg = total / last5Entries.value.length
    
    if (avg >= 8.5) return { label: '9+ hours', color: '#FFC97C' }
    if (avg >= 6.5) return { label: '7-8 hours', color: '#89E780' }
    if (avg >= 4.5) return { label: '5-6 hours', color: '#89CAFF' }
    if (avg >= 2.5) return { label: '3-4 hours', color: '#B8B1FF' }
    return { label: '0-2 hours', color: '#FF9B99' }
  })

  const currentMoodQuote = computed(() => {
    if (!todayEntry.value) return null
    const moodValue = todayEntry.value.mood.toString()
    const quotes = moodQuotes.value[moodValue] || []
    return quotes[Math.floor(Math.random() * quotes.length)]
  })

  const currentMoodLabel = computed(() => {
    if (!todayEntry.value) return null
    const moodMap = {
      '-2': 'Very Sad',
      '-1': 'Sad',
      '0': 'Neutral',
      '1': 'Happy',
      '2': 'Very Happy'
    }
    return moodMap[todayEntry.value.mood]
  })

  // Actions
  const addMoodEntry = (moodData) => {
    const newEntry = {
      createdAt: new Date().toISOString(),
      mood: convertMoodToNumber(moodData.mood),
      feelings: moodData.feelings,
      journalEntry: moodData.dayDescription,
      sleepHours: convertSleepToNumber(moodData.sleepHours)
    }
    
    // Remove any existing entry for today
    const today = new Date().toISOString().split('T')[0]
    moodEntries.value = moodEntries.value.filter(entry => {
      const entryDate = new Date(entry.createdAt).toISOString().split('T')[0]
      return entryDate !== today
    })
    
    // Add new entry
    moodEntries.value.push(newEntry)
    
    // Save to localStorage
    saveMoodData()
  }

  const loadMoodData = () => {
    const saved = localStorage.getItem('moodData')
    if (saved) {
      const data = JSON.parse(saved)
      moodEntries.value = data.moodEntries || []
    }
  }

  const saveMoodData = () => {
    const data = {
      moodEntries: moodEntries.value,
      moodQuotes: moodQuotes.value
    }
    localStorage.setItem('moodData', JSON.stringify(data))
  }

  // Load data on store initialization
  loadMoodData()

  return {
    // State
    moodEntries,
    moodQuotes,
    
    // Computed
    todayEntry,
    hasLoggedToday,
    last5Entries,
    hasEnoughDataForAverages,
    averageMood,
    averageSleep,
    currentMoodQuote,
    currentMoodLabel,
    
    // Actions
    addMoodEntry,
    loadMoodData,
    saveMoodData
  }
})