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
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
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

// Preload images with correct mood mapping
const preloadImages = async () => {
  const iconPaths = {
    "-2": iconVerySadWhite,
    "-1": iconSadWhite,
    0: iconNeutralWhite,
    1: iconHappyWhite,
    2: iconVeryHappyWhite,
  };

  const promises = Object.entries(iconPaths).map(([key, src]) => {
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

// Sleep categories mapping
const getSleepCategoryData = (category) => {
  switch (category) {
    case "9+":
      return { color: "#FFC97C", chartValue: 8 };
    case "7-8":
      return { color: "#89E780", chartValue: 6 };
    case "5-6":
      return { color: "#89CAFF", chartValue: 4 };
    case "3-4":
      return { color: "#B8B1FF", chartValue: 2 };
    case "0-2":
      return { color: "#FF9B99", chartValue: 2 };
    default:
      return { color: "#89CAFF", chartValue: 4 };
  }
};

// Generate the last 11 dates including today
const generateDateRange = () => {
  const dates = [];
  const today = new Date();

  for (let i = 10; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date);
  }

  return dates;
};

// Generate chart data with all dates but only bars for logged days
const generateChartData = () => {
  const dateRange = generateDateRange();

  // Create labels for all dates
  const labels = dateRange.map((date) => {
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate().toString().padStart(2, "0");
    return `${month} ${day}`;
  });

  // Create data array with null values for days without entries
  const sleepData = dateRange.map((date) => {
    const dateStr = date.toISOString().split("T")[0];

    // Find mood entry for this date
    const entry = moodStore.moodEntries.find((entry) => {
      const entryDate = new Date(entry.createdAt).toISOString().split("T")[0];
      return entryDate === dateStr;
    });

    if (entry) {
      // Convert sleep hours to category
      const hours = entry.sleepHours;
      if (hours >= 8.5) return "9+";
      if (hours >= 6.5) return "7-8";
      if (hours >= 4.5) return "5-6";
      if (hours >= 2.5) return "3-4";
      return "0-2";
    }

    return null; // No data for this date
  });

  // Create colors and values arrays
  const colors = sleepData.map((category) =>
    category ? getSleepCategoryData(category).color : "transparent"
  );

  const values = sleepData.map((category) =>
    category ? getSleepCategoryData(category).chartValue : null
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
        maxBarThickness: 40,
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
        label: function (context) {
          const dataIndex = context.dataIndex;
          const dateRange = generateDateRange();
          const date = dateRange[dataIndex];
          const dateStr = date.toISOString().split("T")[0];

          // Find mood entry for this date
          const entry = moodStore.moodEntries.find((entry) => {
            const entryDate = new Date(entry.createdAt)
              .toISOString()
              .split("T")[0];
            return entryDate === dateStr;
          });

          if (entry) {
            const moodLabels = {
              "-2": "Very Sad",
              "-1": "Sad",
              0: "Neutral",
              1: "Happy",
              2: "Very Happy",
            };

            const moodIcons = {
              "-2": "😢",
              "-1": "😞",
              0: "😐",
              1: "😊",
              2: "😄",
            };

            const moodLabel = moodLabels[entry.mood.toString()];
            const moodIcon = moodIcons[entry.mood.toString()];
            const sleepHours =
              entry.sleepHours >= 8.5
                ? "9+"
                : entry.sleepHours >= 6.5
                ? "7-8"
                : entry.sleepHours >= 4.5
                ? "5-6"
                : entry.sleepHours >= 2.5
                ? "3-4"
                : "0-2";

            return [
              `${moodIcon} ${moodLabel}`,
              "",
              "Sleep",
              `${sleepHours} hours`,
              "",
              "Reflection",
              entry.journalEntry || "No reflection added.",
              "",
              "Tags",
              entry.tags && entry.tags.length > 0
                ? entry.tags.join(", ")
                : "No tags",
            ];
          }

          return "No data";
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

// Fixed emoji plugin - position above the bar using bar element
const emojiPlugin = {
  id: "emojiPlugin",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);

    meta.data.forEach((bar, index) => {
      if (!bar || bar.height === 0) return; // Skip if no bar

      const x = bar.x;
      let iconY;

      // Find the corresponding mood entry for this date
      const dateRange = generateDateRange();
      const date = dateRange[index];
      const dateStr = date.toISOString().split("T")[0];

      const entry = moodStore.moodEntries.find((entry) => {
        const entryDate = new Date(entry.createdAt).toISOString().split("T")[0];
        return entryDate === dateStr;
      });

      if (entry && loadedImages[entry.mood]) {
        const iconSize = 30;
        const iconX = x - iconSize / 2;

        // Use bar positioning like the original
        if (bar.height > 100) {
          iconY = bar.y + 5; // Position closer to top
        } else {
          iconY = bar.y + 10; // Normal positioning
        }

        ctx.drawImage(
          loadedImages[entry.mood],
          iconX,
          iconY,
          iconSize,
          iconSize
        );
      }
    });
  },
};

// Watch for changes in mood entries and update chart
watch(
  () => moodStore.moodEntries.length,
  () => {
    if (chartInstance && moodStore.moodEntries.length > 0) {
      chartInstance.data = generateChartData();
      chartInstance.update();
    }
  },
  { deep: true }
);

// Also watch for changes in the entries themselves (not just length)
watch(
  () => moodStore.moodEntries,
  () => {
    if (chartInstance) {
      chartInstance.data = generateChartData();
      chartInstance.update();
    }
  },
  { deep: true }
);

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
