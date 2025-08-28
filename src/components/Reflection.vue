<template>
  <div
    class="bg-white border border-[#E0E6FA] rounded-2xl p-6 flex flex-col items-start justify-between w-full h-full"
  >
    <div class="flex flex-col gap-2">
      <div class="flex flex-row items-center justify-start gap-3">
        <img
          :src="ReflectionIcon"
          alt="Reflection Icon"
          class="w-6 h-6 text-gray-500"
        />
        <p class="text-gray-500 text-lg font-medium">Reflection</p>
      </div>

      <p class="text-indigo-950 text-lg font-normal">{{ reflectionText }}</p>
    </div>
    <div class="flex flex-row items-center justify-start gap-2">
      <p
        v-for="feeling in moodStore.todayEntry?.feelings"
        class="text-gray-400 text-base italic"
      >
        #{{ feeling }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useMoodStore } from "../store/moodStore.js";
import ReflectionIcon from "../assets/images/icon-reflection.svg";

const moodStore = useMoodStore();

const reflectionText = computed(() => {
  return moodStore.todayEntry?.journalEntry || "No reflection for today yet.";
});
</script>
