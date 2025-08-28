<template>
  <div
    class="flex flex-col items-start w-[530px] bg-white py-10 px-8 gap-8 rounded-2xl shadow-md h-auto"
  >
    <div class="flex flex-col items-start gap-2">
      <h1 class="font-bold text-3xl text-indigo-950">
        Personalize your experience
      </h1>
      <p class="text-gray-500 font-normal text-base">
        Add your name and a profile picture to make Mood yours.
      </p>
    </div>

    <form
      @submit.prevent="handleSubmit"
      class="flex flex-col items-start gap-5 w-full"
    >
      <div class="flex flex-col gap-2 w-full">
        <label for="name" class="text-indigo-900">Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="John Doe"
          id="name"
          required
          class="border border-gray-300 rounded-xl p-2 w-full h-12"
        />
      </div>

      <div class="flex flex-col gap-2 w-full">
        <!-- Custom Upload Interface -->
        <div class="p-0 w-full">
          <div class="flex items-center gap-4">
            <!-- Avatar Icon / Uploaded Image -->
            <div
              class="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center overflow-hidden"
            >
              <img
                :src="uploadedImageUrl || IconAvatar"
                alt=""
                :class="uploadedImageUrl ? 'w-full h-full object-cover' : ''"
              />
            </div>

            <!-- Upload Info -->
            <div class="flex-1">
              <h3 class="text-indigo-900">{{ fileName || "Upload Image" }}</h3>
              <p class="text-gray-500 text-sm">Max 250KB, PNG or JPEG</p>
            </div>

            <!-- Upload Button -->
            <button
              type="button"
              @click="triggerFileInput"
              class="bg-white border border-gray-300 text-indigo-900 text-sm px-4 py-1 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Upload
            </button>
          </div>
        </div>

        <!-- Hidden File Input -->
        <input
          ref="fileInput"
          @change="handleFileChange"
          type="file"
          accept=".png,.jpg,.jpeg"
          class="hidden"
        />
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="bg-indigo-500 text-white font-semibold text-lg rounded-xl py-2 px-4 w-full h-12 mt-3 disabled:opacity-50"
      >
        {{ isLoading ? "Setting up..." : "Start tracking" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/authStore.js";
import IconAvatar from "../assets/images/avatar-placeholder.svg";

const router = useRouter();
const authStore = useAuthStore();

const name = ref("");
const profilePicture = ref(null);
const fileName = ref("");
const fileInput = ref(null);
const uploadedImageUrl = ref(null);
const isLoading = ref(false);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    profilePicture.value = file;
    fileName.value = file.name;

    // Create object URL for preview
    uploadedImageUrl.value = URL.createObjectURL(file);
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleSubmit = async () => {
  isLoading.value = true;

  // Convert image to base64 for storage
  let avatarData = null;
  if (profilePicture.value) {
    avatarData = await fileToBase64(profilePicture.value);
  }

  authStore.completeOnboarding(name.value, avatarData);

  isLoading.value = false;
  router.push("/");
};

const fileToBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
};
</script>
