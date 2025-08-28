<template>
  <!-- Modal backdrop -->
  <div
    class="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50"
    @click="$emit('close')"
  >
    <!-- Modal content -->
    <div
      class="flex flex-col items-start w-[600px] bg-white py-12 px-10 gap-8 rounded-2xl shadow-lg"
      @click.stop
    >
      <div class="flex justify-between items-center w-full">
        <h1 class="font-bold text-4xl text-indigo-950">Settings</h1>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <form
        @submit.prevent="handleUpdate"
        class="flex flex-col items-start gap-5 w-full"
      >
        <div class="flex flex-col gap-2 w-full">
          <label for="name" class="text-indigo-900 font-medium">Name</label>
          <input
            v-model="name"
            type="text"
            placeholder="John Doe"
            id="name"
            required
            class="border border-gray-300 rounded-xl p-4 w-full h-12 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div class="flex flex-col gap-2 w-full">
          <label class="text-indigo-900 font-medium">Profile Picture</label>

          <div
            class="p-4 border-2 border-dashed border-gray-300 rounded-xl w-full"
          >
            <div class="flex items-center gap-4">
              <!-- Avatar Preview -->
              <div
                class="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center overflow-hidden"
              >
                <img
                  :src="uploadedImageUrl || currentAvatar || IconAvatar"
                  alt="Profile"
                  :class="
                    uploadedImageUrl || currentAvatar
                      ? 'w-full h-full object-cover'
                      : ''
                  "
                />
              </div>

              <!-- Upload Info -->
              <div class="flex-1">
                <h3 class="text-indigo-900 font-medium">
                  {{ fileName || "Upload New Image" }}
                </h3>
                <p class="text-gray-500 text-sm">Max 250KB, PNG or JPEG</p>
              </div>

              <!-- Upload Button -->
              <button
                type="button"
                @click="triggerFileInput"
                class="bg-white border border-gray-300 text-indigo-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
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

        <!-- Error Message -->
        <div v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="text-green-500 text-sm">
          {{ successMessage }}
        </div>

        <div class="flex gap-4 w-full mt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 bg-gray-200 text-gray-700 font-semibold text-lg rounded-xl py-3 px-6 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            :disabled="isLoading"
            class="flex-1 bg-indigo-500 text-white font-semibold text-lg rounded-xl py-3 px-6 hover:bg-indigo-600 disabled:opacity-50 transition-colors"
          >
            {{ isLoading ? "Updating..." : "Update Profile" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../store/authStore.js";
import IconAvatar from "../assets/images/avatar-placeholder.svg";

const emit = defineEmits(["close"]);

const authStore = useAuthStore();

const name = ref("");
const profilePicture = ref(null);
const fileName = ref("");
const fileInput = ref(null);
const uploadedImageUrl = ref(null);
const currentAvatar = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// Initialize form with current user data
onMounted(() => {
  name.value = authStore.userName;
  currentAvatar.value = authStore.userAvatar;
});

const handleFileChange = (event) => {
  const file = event.target.files[0];

  if (file) {
    // Check file size (250KB = 256000 bytes)
    if (file.size > 256000) {
      errorMessage.value = "File size must be less than 250KB";
      return;
    }

    // Check file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      errorMessage.value = "Only PNG and JPEG files are allowed";
      return;
    }

    errorMessage.value = "";
    profilePicture.value = file;
    fileName.value = file.name;

    // Create object URL for preview
    if (uploadedImageUrl.value) {
      URL.revokeObjectURL(uploadedImageUrl.value);
    }
    uploadedImageUrl.value = URL.createObjectURL(file);
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleUpdate = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  isLoading.value = true;

  try {
    let avatarData = currentAvatar.value;

    // Convert new image to base64 if uploaded
    if (profilePicture.value) {
      avatarData = await fileToBase64(profilePicture.value);
    }

    // Update user profile
    authStore.updateProfile(name.value, avatarData);

    successMessage.value = "Profile updated successfully!";

    // Close modal after short delay
    setTimeout(() => {
      emit("close");
    }, 1500);
  } catch (error) {
    errorMessage.value = "Failed to update profile. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
</script>
