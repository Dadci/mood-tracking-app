<template>
  <div class="w-full space-y-8 px-32">
    <!-- Top row - Only show when mood is logged today -->
    <div
      v-if="moodStore.hasLoggedToday"
      class="grid grid-cols-12 gap-8 h-[320px]"
    >
      <!-- Feelings Card -->
      <div class="col-span-7 row-span-5">
        <Feelings />
      </div>

      <!-- Sleep Card -->
      <div class="col-span-5 row-span-1">
        <Sleep />
      </div>

      <!-- Reflection Card -->
      <div class="col-span-5 row-span-4">
        <Reflection />
      </div>
    </div>

    <!-- Bottom row - Always show -->
    <div class="grid grid-cols-12 gap-8 h-[400px]">
      <div class="col-span-4 row-span-3">
        <Mood />
      </div>
      <div class="col-span-8 row-span-3">
        <ChartBar />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMoodStore } from "../store/moodStore.js";
import Feelings from "./Feelings.vue";
import Sleep from "./Sleep.vue";
import Reflection from "./Reflection.vue";
import Mood from "./Mood.vue";
import ChartBar from "./ChartBar.vue";

const moodStore = useMoodStore();
</script>
