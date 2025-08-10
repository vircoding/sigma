<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'agent'],
});

const { refresh } = useAuth();
const form = useTemplateRef('form');
const userStore = useUserStore();

const headers = computed(() => {
  return {
    Authorization: `Bearer ${useCookie('access_token').value}`,
  };
});

const { status, data, error } = await useLazyFetch('/api/auth', { headers });

async function onStatus() {
  if (status.value === 'success' && data.value) {
    if (data.value.user.type === 'agent' && form.value) {
      userStore.setUser(data.value.user);
      form.value.syncData();
    } else showError(createError({ status: 500 }));
  } else if (status.value === 'error' && error.value) {
    if (
      error.value.statusCode === 401 &&
      error.value.data.message === 'The access token has expired'
    ) {
      await refresh();
    } else showError(createError({ status: 500 }));
  }
}

watch(status, () => {
  onStatus();
});

onMounted(async () => {
  onStatus();
});
</script>

<template>
  <UContainer :class="[useStyles().pageContainer]">
    <FormUpdateAgent v-if="userStore.user?.type === 'agent'" ref="form" />
  </UContainer>
</template>
