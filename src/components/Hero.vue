<template>
  <div class="px-32 flex flex-col items-center justify-center">
    <div class="flex flex-col items-center justify-center gap-6">
      <h3 class="text-3xl text-indigo-500 font-bold">
        Hello, {{ authStore.userName }}!
      </h3>
      <h1 class="text-6xl font-bold text-indigo-950 tracking-tight">
        How are you feeling today?
      </h1>
      <p class="text-gray-500 font-medium">{{ formattedDate }}</p>
    </div>
  </div>
  <button
    v-if="!moodStore.hasLoggedToday"
    type="button"
    @click="$emit('open-mood-form')"
    class="bg-indigo-500 hover:bg-indigo-700 cursor-pointer text-white font-semibold text-lg rounded-[10px] py-3.5 px-8"
  >
    Log today's mood
  </button>
</template>

<script setup>
import { useMoodStore } from "../store/moodStore.js";
import { useAuthStore } from "../store/authStore.js";

defineEmits(["open-mood-form"]);

const moodStore = useMoodStore();
const authStore = useAuthStore();

const date = new Date();
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const formattedDate = date.toLocaleDateString("en-US", options);
</script>
