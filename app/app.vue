<script setup lang="ts">
const { setPrimaryColor } = useUIConfig();

const uiStore = useUIStore();
const { colorPostType } = storeToRefs(uiStore);

watch(colorPostType, (newType: PostType) => {
  setPrimaryColor(newType);
  console.log('Setting up a new primary color: ', newType);
});

const initLoading = ref(true);

onMounted(async () => {
  initLoading.value = false;
});
</script>

<template>
  <div class="font-quicksand" :class="[useStyles().textColorSecondary, useStyles().textSizeBase]">
    <span>{{ colorPostType }}</span>

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
