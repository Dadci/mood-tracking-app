<template>
  <!-- Modal backdrop -->
  <div
    class="fixed inset-0 bg-black/75 flex items-center justify-center p-4"
    @click="$emit('close')"
  >
    <!-- Modal content -->
    <div
      class="flex flex-col items-start w-[600px] bg-white py-12 px-10 gap-8 rounded-2xl shadow-lg"
      @click.stop
    >
      <div class="flex flex-col items-start gap-2 w-full">
        <div class="flex justify-between items-center w-full">
          <h1 class="font-bold text-4xl text-indigo-950">Log your mood</h1>

          <button
            @click="$emit('close')"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Stepper -->
      <Stepper :current-step="currentStep" :steps="4" />

      <form
        class="flex flex-col items-start gap-2 w-full"
        @submit.prevent="handleNext"
      >
        <!-- Step 1: Mood Selection -->
        <div v-if="currentStep === 1" class="w-full">
          <h2 class="text-2xl font-semibold text-indigo-950 mb-6">
            How was your mood today?
          </h2>
          <div class="space-y-3">
            <label
              v-for="mood in moodOptions"
              :key="mood.value"
              class="flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer hover:bg-gray-50"
              :class="
                selectedMood === mood.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200'
              "
            >
              <div class="flex items-center">
                <input
                  type="radio"
                  :value="mood.value"
                  v-model="selectedMood"
                  class="mr-4 text-indigo-500"
                />
                <span class="text-lg font-medium">{{ mood.label }}</span>
              </div>
              <img :src="mood.icon" :alt="mood.label" class="w-8 h-8" />
            </label>
          </div>
        </div>

        <!-- Step 2: Feelings Tags -->
        <div v-if="currentStep === 2" class="w-full">
          <h2 class="text-2xl font-semibold text-indigo-950 mb-2">
            How did you feel?
          </h2>
          <p class="text-gray-600 mb-6">Select up to three tags:</p>
          <div class="grid grid-cols-3 gap-3">
            <label
              v-for="feeling in feelingOptions"
              :key="feeling.value"
              class="flex items-center p-3 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
              :class="
                selectedFeelings.includes(feeling.value)
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200'
              "
            >
              <input
                type="checkbox"
                :value="feeling.value"
                v-model="selectedFeelings"
                :disabled="
                  selectedFeelings.length >= 3 &&
                  !selectedFeelings.includes(feeling.value)
                "
                class="mr-3 text-indigo-500"
              />
              <span class="text-sm font-medium">{{ feeling.label }}</span>
            </label>
          </div>
        </div>

        <!-- Step 3: Write about your day -->
        <div v-if="currentStep === 3" class="w-full">
          <h2 class="text-2xl font-semibold text-indigo-950 mb-6">
            Write about your day...
          </h2>
          <textarea
            v-model="dayDescription"
            placeholder="Today I felt..."
            class="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-indigo-500 focus:outline-none text-base"
          ></textarea>
        </div>

        <!-- Step 4: Sleep Hours -->
        <div v-if="currentStep === 4" class="w-full">
          <h2 class="text-2xl font-semibold text-indigo-950 mb-6">
            How many hours did you sleep last night?
          </h2>
          <div class="space-y-3">
            <label
              v-for="sleep in sleepOptions"
              :key="sleep.value"
              class="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50"
              :class="
                selectedSleep === sleep.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200'
              "
            >
              <input
                type="radio"
                :value="sleep.value"
                v-model="selectedSleep"
                class="mr-4 text-indigo-500"
              />
              <span class="text-lg font-medium">{{ sleep.label }}</span>
            </label>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex w-full mt-6">
          <button
            type="submit"
            :disabled="!isCurrentStepValid"
            :class="[
              'font-semibold text-lg rounded-xl py-2 px-6 h-14 w-full transition-colors',
              isCurrentStepValid
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
          >
            {{ currentStep === 4 ? "Submit" : "Continue" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useMoodStore } from "../store/moodStore.js";
import Stepper from "./Stepper.vue";
import Sad from "../assets/images/icon-sad-color.svg";
import Happy from "../assets/images/icon-happy-color.svg";
import Neutral from "../assets/images/icon-neutral-color.svg";
import VerySad from "../assets/images/icon-very-sad-color.svg";
import VeryHappy from "../assets/images/icon-very-happy-color.svg";

const emit = defineEmits(["close"]);
const moodStore = useMoodStore();

const currentStep = ref(1);
const selectedMood = ref("");
const selectedFeelings = ref([]);
const dayDescription = ref("");
const selectedSleep = ref("");

// Validation computed property
const isCurrentStepValid = computed(() => {
  switch (currentStep.value) {
    case 1:
      return selectedMood.value !== "";
    case 2:
      return selectedFeelings.value.length > 0;
    case 3:
      return dayDescription.value.trim() !== "";
    case 4:
      return selectedSleep.value !== "";
    default:
      return false;
  }
});

const moodOptions = [
  { value: "very-happy", label: "Very Happy", icon: VeryHappy },
  { value: "happy", label: "Happy", icon: Happy },
  { value: "neutral", label: "Neutral", icon: Neutral },
  { value: "sad", label: "Sad", icon: Sad },
  { value: "very-sad", label: "Very Sad", icon: VerySad },
];

const feelingOptions = [
  { value: "joyful", label: "Joyful" },
  { value: "down", label: "Down" },
  { value: "anxious", label: "Anxious" },
  { value: "calm", label: "Calm" },
  { value: "excited", label: "Excited" },
  { value: "frustrated", label: "Frustrated" },
  { value: "lonely", label: "Lonely" },
  { value: "grateful", label: "Grateful" },
  { value: "overwhelmed", label: "Overwhelmed" },
  { value: "motivated", label: "Motivated" },
  { value: "irritable", label: "Irritable" },
  { value: "peaceful", label: "Peaceful" },
  { value: "tired", label: "Tired" },
  { value: "hopeful", label: "Hopeful" },
  { value: "confident", label: "Confident" },
  { value: "stressed", label: "Stressed" },
  { value: "content", label: "Content" },
  { value: "disappointed", label: "Disappointed" },
  { value: "optimistic", label: "Optimistic" },
  { value: "restless", label: "Restless" },
];

const sleepOptions = [
  { value: "9-plus", label: "9+ hours" },
  { value: "7-8", label: "7-8 hours" },
  { value: "5-6", label: "5-6 hours" },
  { value: "3-4", label: "3-4 hours" },
  { value: "0-2", label: "0-2 hours" },
];

const handleNext = () => {
  if (!isCurrentStepValid.value) return;

  if (currentStep.value < 4) {
    currentStep.value++;
  } else {
    // Save the mood data to store
    const moodData = {
      mood: selectedMood.value,
      feelings: selectedFeelings.value,
      dayDescription: dayDescription.value,
      sleepHours: selectedSleep.value,
    };

    moodStore.addMoodEntry(moodData);
    emit("close");
  }
};
</script>
