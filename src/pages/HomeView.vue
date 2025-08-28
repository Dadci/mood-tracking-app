<template>
  <div
    class="bg-gradient-to-t from-violet-100 to-slate-50 w-screen min-h-screen flex flex-col items-center justify-start gap-16 pt-10 pb-32"
  >
    <NavBar />
    <Hero @open-mood-form="openMoodForm" />
    <BentoCards />

    <!-- Modal -->
    <div
      v-if="showMoodForm"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <LogMoodForm @close="closeMoodForm" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BentoCards from "../components/BentoCards.vue";
import Hero from "../components/Hero.vue";
import NavBar from "../components/NavBar.vue";
import LogMoodForm from "../components/LogMoodForm.vue";

const showMoodForm = ref(false);

const openMoodForm = () => {
  showMoodForm.value = true;
};

const closeMoodForm = () => {
  showMoodForm.value = false;
};
</script>
