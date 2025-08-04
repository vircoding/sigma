<script setup lang="ts">
const initLoading = ref(true);

onMounted(async () => {
  initLoading.value = false;
  const config = useRuntimeConfig();
  console.log(config);
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
