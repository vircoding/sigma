<script setup lang="ts">
import { FatalError } from '~/models/Error';

const initLoading = ref(true);
const { refresh, getUser } = useAuth();
const { initAuth } = useClient();

onMounted(async () => {
  try {
    await refresh();
    await getUser();
  } catch (error) {
    if (error instanceof FatalError) showError(createError({ status: 500 }));
  }

  await initAuth();
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
  </div>
</template>

<style>
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

html.dark ::-webkit-scrollbar-track {
  background: #262626;
}

html.dark ::-webkit-scrollbar-thumb {
  background: #404040;
}

html.dark ::-webkit-scrollbar-thumb:hover {
  background: #525252;
}
</style>
