<template>
  <div
    class="bg-white border border-[#E0E6FA] rounded-2xl p-6 flex flex-col items-start justify-between w-full h-full"
  >
    <div class="flex flex-row items-center gap-3">
      <img :src="SleepIcon" class="w-6 h-6 text-gray-500" alt="Sleep Icon" />
      <p class="text-gray-500 text-lg font-medium">Sleep</p>
    </div>

    <p class="text-indigo-950 text-3xl font-bold">{{ sleepDisplay }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useMoodStore } from "../store/moodStore.js";
import SleepIcon from "../assets/images/icon-sleep.svg";

const moodStore = useMoodStore();

const sleepDisplay = computed(() => {
  if (!moodStore.todayEntry) return "--";

  const hours = moodStore.todayEntry.sleepHours;
  if (hours >= 8.5) return "9+ hours";
  if (hours >= 6.5) return "7-8 hours";
  if (hours >= 4.5) return "5-6 hours";
  if (hours >= 2.5) return "3-4 hours";
  return "0-2 hours";
});
</script>
