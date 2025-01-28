<script setup lang="ts">
const initLoading = ref(true);

onMounted(async () => {
  initLoading.value = false;
});
</script>

<template>
  <div class="font-quicksand" :class="[useStyles().textColorSecondary, useStyles().textSizeBase]">
    <!-- Init Loading -->
    <UIInit v-if="initLoading" />

    <!-- Content -->
    <NuxtLayout :class="{ hidden: initLoading }">
      <NuxtPage />
    </NuxtLayout>

    <!-- Modals Agent -->
    <UModals />

    <!-- Notifications Agent -->
    <UNotifications />
  </div>
</template>

<style>
/* Scrollbar Styles */
html ::-webkit-scrollbar {
  position: absolute;
  width: 8px;
}

html ::-webkit-scrollbar-track {
  background: #f5f5f5;
}

html ::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 5px;
}

html ::-webkit-scrollbar-thumb:hover {
  background: #a3a3a3;
}

/* Scrollbar Dark Styles */
html.dark ::-webkit-scrollbar-track {
  background: #262626;
}

html.dark ::-webkit-scrollbar-thumb {
  background: #404040;
}

html.dark ::-webkit-scrollbar-thumb:hover {
  background: #525252;
}

/* Cropper */
.vue-advanced-cropper__background {
  background-color: white;
}

html.dark .vue-advanced-cropper__background {
  background-color: black;
}

.vue-simple-handler {
  background-color: white;
  border-radius: 50%;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));
}

html.dark .vue-simple-handler {
  background-color: #e5e5e5;
}
</style>
