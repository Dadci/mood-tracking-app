<template>
  <div class="flex items-center w-full mb-2 gap-2">
    <div
      v-for="step in steps"
      :key="step"
      :class="[
        'h-2 flex-1 rounded-full transition-colors duration-300',
        currentStep >= step ? 'bg-indigo-500' : 'bg-gray-200',
      ]"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
  steps: {
    type: Number,
    default: 4,
  },
});
</script>
