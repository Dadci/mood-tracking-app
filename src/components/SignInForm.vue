<template>
  <div
    class="flex flex-col items-start w-[530px] bg-white py-10 px-8 gap-8 rounded-2xl shadow-md h-auto"
  >
    <div class="flex flex-col items-start gap-2">
      <h1 class="font-bold text-3xl text-indigo-950">Create an account</h1>
      <p class="text-gray-500 font-normal text-base">
        Join to track your daily mood and sleep with ease.
      </p>
    </div>

    <form
      @submit.prevent="handleSignUp"
      class="flex flex-col items-start gap-5 w-full"
    >
      <div class="flex flex-col gap-2 w-full">
        <label for="email" class="text-indigo-900">Email address</label>
        <input
          v-model="email"
          type="email"
          placeholder="name@mail.com"
          id="email"
          required
          class="border border-gray-300 rounded-xl p-2 w-full h-12"
        />
      </div>

      <div class="flex flex-col gap-2 w-full">
        <label for="password" class="text-indigo-900">Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          required
          minlength="6"
          class="border border-gray-300 rounded-xl p-2 w-full h-12"
        />
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="text-red-500 text-sm">
        {{ errorMessage }}
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="bg-indigo-500 text-white font-semibold text-lg rounded-xl py-2 px-4 w-full h-12 mt-3 disabled:opacity-50"
      >
        {{ isLoading ? "Creating Account..." : "Sign Up" }}
      </button>

      <p class="text-sm text-gray-500 self-center">
        Already got an account?
        <router-link to="/login" class="text-indigo-500">Log In</router-link>.
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/authStore.js";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

const handleSignUp = async () => {
  errorMessage.value = "";
  isLoading.value = true;

  const result = await authStore.signUp(email.value, password.value);

  if (result.success) {
    router.push("/onboarding");
  } else {
    errorMessage.value = result.error;
  }

  isLoading.value = false;
};
</script>
