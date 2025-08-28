<template>
  <div
    class="bg-white border border-[#E0E6FA] rounded-2xl p-8 flex flex-col w-full h-full"
  >
    <h1 class="text-indigo-950 text-3xl font-bold mb-2">
      Mood and sleep trends
    </h1>

    <div class="flex-1 relative">
      <!-- Show empty state if no mood entries -->
      <div
        v-if="moodStore.moodEntries.length === 0"
        class="h-full flex items-center justify-center"
      >
        <div class="text-center">
          <p class="text-gray-500 text-lg font-medium mb-2">
            Start tracking to see trends
          </p>
          <p class="text-gray-400 text-sm">
            Your mood and sleep patterns will appear here
          </p>
        </div>
      </div>
      <!-- Show chart when there are entries -->
      <canvas v-else ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { Chart, registerables } from "chart.js";
import { useMoodStore } from "../store/moodStore.js";

// Import mood icons
import iconVerySadWhite from "../assets/images/icon-very-sad-white.svg";
import iconSadWhite from "../assets/images/icon-sad-white.svg";
import iconNeutralWhite from "../assets/images/icon-neutral-white.svg";
import iconHappyWhite from "../assets/images/icon-happy-white.svg";
import iconVeryHappyWhite from "../assets/images/icon-very-happy-white.svg";

Chart.register(...registerables);

const moodStore = useMoodStore();
const chartCanvas = ref(null);
let chartInstance = null;
let loadedImages = {};

// Generate dynamic dates (last 11 days)
const generateDynamicDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 10; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate().toString().padStart(2, "0");

    dates.push(`${month} ${day}`);
  }

  return dates;
};

// Preload images
const preloadImages = async () => {
  const iconPaths = [
    { key: "verySad", src: iconVerySadWhite },
    { key: "sad", src: iconSadWhite },
    { key: "neutral", src: iconNeutralWhite },
    { key: "happy", src: iconHappyWhite },
    { key: "veryHappy", src: iconVeryHappyWhite },
  ];

  const promises = iconPaths.map(({ key, src }) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        loadedImages[key] = img;
        resolve();
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        reject();
      };
      img.src = src;
    });
  });

  try {
    await Promise.all(promises);
    console.log("All images loaded successfully");
  } catch (error) {
    console.error("Error loading images:", error);
  }
};

// FIXED: Sleep categories mapping with proper chart values
const getSleepCategoryData = (category) => {
  switch (category) {
    case "9+":
      return { color: "#FFC97C", emoji: "veryHappy", chartValue: 8 }; // 9+ hours - Yellow
    case "7-8":
      return { color: "#89E780", emoji: "happy", chartValue: 6 }; // 7-8 hours - Green
    case "5-6":
      return { color: "#89CAFF", emoji: "neutral", chartValue: 4 }; // 5-6 hours - Blue
    case "3-4":
      return { color: "#B8B1FF", emoji: "sad", chartValue: 2 }; // 3-4 hours - Violet
    case "0-2":
      return { color: "#FF9B99", emoji: "verySad", chartValue: 2 }; // 0-2 hours - Red (increased to 2)
    default:
      return { color: "#89CAFF", emoji: "neutral", chartValue: 4 };
  }
};

// Sample sleep category data (predefined categories from radio/select)
const sleepCategoryData = [
  "5-6",
  "9+",
  "3-4",
  "7-8",
  "7-8",
  "9+",
  "0-2",
  "5-6",
  "7-8",
  "0-2",
  "9+",
];

// Generate colors and chart data dynamically
const generateChartData = () => {
  if (moodStore.moodEntries.length === 0) {
    return {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderRadius: {
            topLeft: 24,
            topRight: 24,
            bottomLeft: 24,
            bottomRight: 24,
          },
          borderSkipped: false,
        },
      ],
    };
  }

  // Sort entries by date and get last 11 entries
  const sortedEntries = [...moodStore.moodEntries]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-11);

  const labels = sortedEntries.map((entry) => {
    const date = new Date(entry.createdAt);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate().toString().padStart(2, "0");
    return `${month} ${day}`;
  });

  const sleepData = sortedEntries.map((entry) => {
    // Convert sleep hours back to categories for color mapping
    const hours = entry.sleepHours;
    if (hours >= 8.5) return "9+";
    if (hours >= 6.5) return "7-8";
    if (hours >= 4.5) return "5-6";
    if (hours >= 2.5) return "3-4";
    return "0-2";
  });

  const colors = sleepData.map(
    (category) => getSleepCategoryData(category).color
  );
  const values = sleepData.map(
    (category) => getSleepCategoryData(category).chartValue
  );

  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderRadius: {
          topLeft: 24,
          topRight: 24,
          bottomLeft: 24,
          bottomRight: 24,
        },
        borderSkipped: false,
        barThickness: 40,
      },
    ],
  };
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 40,
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: "white",
      titleColor: "#1F2937",
      bodyColor: "#6B7280",
      borderColor: "#E5E7EB",
      borderWidth: 1,
      cornerRadius: 12,
      displayColors: false,
      padding: 16,
      bodyFont: {
        size: 14,
      },
      titleFont: {
        size: 16,
        weight: "bold",
      },
      callbacks: {
        title: function (tooltipItems) {
          return "Mood";
        },
        label: (context) => {
          const category = sleepCategoryData[context.dataIndex];
          return `Sleep: ${category} hours`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 8,
      ticks: {
        stepSize: 2,
        callback: function (value) {
          const labels = [
            "",
            "0-2 hours",
            "3-4 hours",
            "5-6 hours",
            "7-8 hours",
            "9+ hours",
          ];
          return labels[Math.floor(value / 2) + 1] || "";
        },
        font: { size: 12 },
        color: "#6B7280",
      },
      grid: { display: true },
      border: { display: false },
    },
    x: {
      ticks: {
        font: {
          size: 12,
          weight: 600,
        },
        color: "#6B7280",
      },
      grid: { display: false },
      border: { display: false },
    },
  },
  elements: {
    bar: { borderWidth: 0 },
  },
};

// Dynamic emoji plugin with better positioning for small bars
const emojiPlugin = {
  id: "emojiPlugin",
  afterDatasetsDraw(chart) {
    const ctx = chart.ctx;

    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      meta.data.forEach((bar, index) => {
        const category = sleepCategoryData[index];
        const sleepData = getSleepCategoryData(category);
        const img = loadedImages[sleepData.emoji];

        if (img && img.complete) {
          const iconSize = 30; // Reduced size for better fit
          const barHeight = Math.abs(bar.base - bar.y);

          // Adjust positioning based on bar height
          let iconY;
          if (barHeight < 40) {
            // For very small bars
            iconY = bar.y + 5; // Position closer to top
          } else {
            iconY = bar.y + 10; // Normal positioning
          }

          ctx.save();
          ctx.drawImage(img, bar.x - iconSize / 2, iconY, iconSize, iconSize);
          ctx.restore();
        }
      });
    });
  },
};

onMounted(async () => {
  await preloadImages();

  if (chartCanvas.value && moodStore.moodEntries.length > 0) {
    chartInstance = new Chart(chartCanvas.value, {
      type: "bar",
      data: generateChartData(),
      options: chartOptions,
      plugins: [emojiPlugin],
    });
  }
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});
</script>
