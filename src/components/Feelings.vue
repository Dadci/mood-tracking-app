<template>
  <div
    class="bg-white border border-[#E0E6FA] rounded-2xl p-8 flex flex-row gap-8 items-start justify-between h-full relative overflow-hidden"
  >
    <div class="flex flex-col items-start justify-between h-full w-full">
      <div class="flex flex-col gap-2">
        <h2 class="font-bold text-3xl text-gray-500">I'm feeling</h2>
        <h1 class="text-indigo-950 text-4xl font-extrabold">
          {{ moodStore.currentMoodLabel }}
        </h1>
      </div>

      <div class="flex flex-col gap-2 w-[45%]">
        <img :src="IconQuote" class="w-6 h-6" alt="" />
        <h1 class="text-indigo-950 text-lg font-normal italic">
          {{ moodStore.currentMoodQuote }}
        </h1>
      </div>
    </div>

    <img
      :src="currentMoodIcon"
      class="absolute -bottom-8 right-8 w-[320px] h-[320px] hover:-rotate-12 hover:-bottom-4 transition-all duration-300"
      alt=""
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMoodStore } from '../store/moodStore.js';
import IconQuote from '../assets/images/icon-quote.svg';
import EmojiVeryHappy from '../assets/images/icon-very-happy-color.svg';
import EmojiHappy from '../assets/images/icon-happy-color.svg';
import EmojiNeutral from '../assets/images/icon-neutral-color.svg';
import EmojiSad from '../assets/images/icon-sad-color.svg';
import EmojiVerySad from '../assets/images/icon-very-sad-color.svg';

const moodStore = useMoodStore();

const currentMoodIcon = computed(() => {
    if (!moodStore.todayEntry) return EmojiNeutral;

    const moodIconMap = {
        [-2]: EmojiVerySad,
        [-1]: EmojiSad,
        [0]: EmojiNeutral,
        [1]: EmojiHappy,
        [2]: EmojiVeryHappy
    };

    return moodIconMap[moodStore.todayEntry.mood] || EmojiNeutral;
});
</script>
