<script setup lang="ts">
// const userStore = useUserStore();

const initLoading = ref(true);

// async function initUser() {
//   const accessToken = useCookie('access_token');

//   if (accessToken.value) {
//     await $fetch('/api/auth', {
//       headers: {
//         Authorization: `Bearer ${useCookie('access_token').value}`,
//       },
//     })
//       .then((data) => {
//         userStore.setUser(data.user);
//       })
//       .catch(() => {
//         showError(createError({ status: 500 }));
//       });
//   }
// }

// initUser();

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
</style>
