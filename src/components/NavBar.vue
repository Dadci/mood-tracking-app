<template>
  <div class="flex flex-row items-center justify-between px-32 w-screen">
    <img :src="Logo" alt="logo" class="" />

    <!-- User Profile with Dropdown -->
    <div class="relative">
      <button @click="toggleDropdown" class="flex items-center gap-2">
        <img
          :src="authStore.userAvatar || Placeholder"
          alt="avatar"
          class="rounded-full w-12 h-12 object-cover"
        />
        <img :src="DropdownIcon" alt="Dropdown" class="w-4 h-4" />
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="isDropdownOpen"
        class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
      >
        <!-- User Info Section -->
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="font-semibold text-gray-900">{{ authStore.userName }}</p>
          <p class="text-sm text-gray-500">{{ authStore.userEmail }}</p>
        </div>

        <!-- Menu Items -->
        <div class="py-1">
          <button
            @click="openSettings"
            class="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
          >
            <img :src="SettingsIcon" alt="Settings" class="w-5 h-5" />
            <span class="text-gray-700">Settings</span>
          </button>

          <button
            @click="logout"
            class="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
          >
            <img :src="LogoutIcon" alt="Logout" class="w-5 h-5" />
            <span class="text-gray-700">Logout</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <SettingsModal v-if="isSettingsOpen" @close="closeSettings" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/authStore.js";
import Logo from "../assets/images/logo.svg";
import Avatar from "../assets/images/avatar-lisa.jpg";
import Placeholder from "../assets/images/avatar-placeholder.svg";
import LogoutIcon from "../assets/images/icon-logout.svg";
import SettingsIcon from "../assets/images/icon-settings.svg";
import DropdownIcon from "../assets/images/icon-dropdown-arrow.svg";
import SettingsModal from "./SettingsModal.vue";

const router = useRouter();
const authStore = useAuthStore();

const isDropdownOpen = ref(false);
const isSettingsOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const openSettings = () => {
  isSettingsOpen.value = true;
  closeDropdown();
};

const closeSettings = () => {
  isSettingsOpen.value = false;
};

const logout = () => {
  authStore.logout();
  router.push("/signin");
  closeDropdown();
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (isDropdownOpen.value && !event.target.closest(".relative")) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
