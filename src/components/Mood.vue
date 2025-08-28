<template>
  <div
    class="bg-white border border-[#E0E6FA] rounded-2xl p-6 flex flex-col items-start justify-between gap-6 w-full h-full"
  >
    <div class="flex flex-col gap-3 w-full">
      <h3 class="text-indigo-950 text-lg font-semibold">
        Average Mood
        <span class="text-gray-500 text-sm font-normal"
          >(Last 5 check-ins)</span
        >
      </h3>

      <!-- Not enough data -->
      <div
        v-if="!moodStore.hasEnoughDataForAverages"
        class="w-full rounded-[20px] bg-[#E0E6FA] relative overflow-hidden px-4 py-10 space-y-3"
      >
        <div class="flex flex-row items-center gap-3">
          <p class="text-indigo-950 text-2xl font-semibold">Keep tracking!</p>
        </div>
        <div class="flex flex-row items-center gap-3">
          <p class="text-indigo-950 text-base font-light">
            Log 5 check-ins to see your average mood.
          </p>
        </div>
        <img
          :src="BgCard"
          alt="Background Card"
          class="absolute inset-0 left-[270px] w-full h-full scale-200"
        />
      </div>

      <!-- Has enough data -->
      <div
        v-else
        class="w-full rounded-[20px] relative overflow-hidden px-4 py-10 space-y-3"
        :style="{ backgroundColor: moodStore.averageMood.color }"
      >
        <div class="flex flex-row items-center gap-3">
          <img :src="averageMoodIcon" alt="Mood Icon" class="w-6 h-6" />
          <p class="text-indigo-950 text-2xl font-semibold">
            {{ moodStore.averageMood.label }}
          </p>
        </div>
        <div class="flex flex-row items-center gap-3">
          <img :src="Arrow" alt="Trend Icon" class="w-4 h-4" />
          <p class="text-indigo-950 text-base font-normal">
            Based on your last 5 check-ins
          </p>
        </div>
        <img
          :src="BgCard"
          alt="Background Card"
          class="absolute inset-0 left-[270px] w-full h-full scale-200"
        />
      </div>
    </div>

    <div class="flex flex-col gap-3 w-full">
      <h3 class="text-indigo-950 text-lg font-semibold">
        Average Sleep
        <span class="text-gray-500 text-sm font-normal"
          >(Last 5 check-ins)</span
        >
      </h3>

      <!-- Not enough data -->
      <div
        v-if="!moodStore.hasEnoughDataForAverages"
        class="w-full rounded-[20px] bg-[#E0E6FA] relative overflow-hidden px-4 py-10 space-y-3"
      >
        <div class="flex flex-row items-center gap-3">
          <p class="text-indigo-950 text-2xl font-semibold">
            Not enough data yet!
          </p>
        </div>
        <div class="flex flex-row items-center gap-3">
          <p class="text-indigo-950 text-base font-light">
            Track 5 nights to view average sleep.
          </p>
        </div>
        <img
          :src="BgCard"
          alt="Background Card"
          class="absolute inset-0 left-[270px] w-full h-full scale-200"
        />
      </div>

      <!-- Has enough data -->
      <div
        v-else
        class="w-full rounded-[20px] relative overflow-hidden px-4 py-10 space-y-3"
        :style="{ backgroundColor: moodStore.averageSleep.color }"
      >
        <div class="flex flex-row items-center gap-3">
          <img
            :src="SleepIcon"
            alt="Sleep Icon"
            :class="
              moodStore.averageSleep.color === '#89E780'
                ? 'filter brightness-0'
                : 'filter brightness-0 invert'
            "
            class="w-6 h-6"
          />
          <p
            :class="
              moodStore.averageSleep.color === '#89E780'
                ? 'text-indigo-950'
                : 'text-white'
            "
            class="text-2xl font-semibold"
          >
            {{ moodStore.averageSleep.label }}
          </p>
        </div>
        <div class="flex flex-row items-center gap-3">
          <img
            :src="Arrow"
            alt="Arrow Icon"
            :class="
              moodStore.averageSleep.color === '#89E780'
                ? 'filter brightness-0'
                : 'filter brightness-0 invert'
            "
            class="w-4 h-4"
          />
          <p
            :class="
              moodStore.averageSleep.color === '#89E780'
                ? 'text-indigo-950'
                : 'text-white/65'
            "
            class="text-base font-normal"
          >
            Based on your last 5 check-ins
          </p>
        </div>
        <img
          :src="BgCard"
          alt="Background Card"
          class="absolute inset-0 left-[270px] w-full h-full scale-200"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMoodStore } from '../store/moodStore.js';
import BgCard from '../assets/images/bg-pattern-averages.svg';
import HappyIcon from '../assets/images/icon-happy-white.svg';
import VeryHappyIcon from '../assets/images/icon-very-happy-white.svg';
import NeutralIcon from '../assets/images/icon-neutral-white.svg';
import SadIcon from '../assets/images/icon-sad-white.svg';
import VerySadIcon from '../assets/images/icon-very-sad-white.svg';
import Arrow from '../assets/images/icon-trend-same.svg';
import SleepIcon from '../assets/images/icon-sleep.svg';

const moodStore = useMoodStore();

const averageMoodIcon = computed(() => {
    if (!moodStore.averageMood) return NeutralIcon;

    const iconMap = {
        '-2': VerySadIcon,
        '-1': SadIcon,
        '0': NeutralIcon,
        '1': HappyIcon,
        '2': VeryHappyIcon
    };

    return iconMap[moodStore.averageMood.value] || NeutralIcon;
});
</script>
