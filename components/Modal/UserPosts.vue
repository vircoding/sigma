<script setup lang="ts">
const userStore = useUserStore();

const headers = computed(() => {
  return {
    Authorization: `Bearer ${useCookie('access_token').value}`,
  };
});

const { status, data, error, refresh: refreshData } = await useLazyFetch('/api/posts', { headers });
const { refresh } = useAuth();
const modals = useModal();

async function onCloseModal() {
  await modals.close();
}

function onPostDeleted() {
  refreshData();
}

async function onStatus() {
  if (status.value === 'error' && error.value) {
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
  <UModal
    :ui="{
      container: 'items-center',
      padding: 'py-12',
      width: 'sm:w-[95%] max-w-80 sm:max-w-[640px] md:max-w-[724px] lg:max-w-[740px]',
    }"
  >
    <UContainer class="w-full p-4 sm:p-6 lg:p-8">
      <!-- Loading Animation -->
      <div
        v-if="status === 'pending'"
        class="flex w-[80vw] flex-col items-center justify-center gap-y-5 pb-4 pt-5 text-center sm:w-auto"
      >
        <div class="flex items-center gap-x-2">
          <div class="loader scale-[.80]"></div>
          <div class="text-loader font-ubuntu"></div>
        </div>
      </div>

      <!-- No Posts -->
      <div
        v-else-if="status === 'success' && data && data.posts.length === 0"
        class="flex w-[80vw] flex-col items-center justify-center gap-y-5 pb-4 pt-5 text-center sm:w-auto"
      >
        <h6
          class="text-nowrap font-ubuntu font-semibold leading-none"
          :class="[useStyles().textColorPrimary, useStyles().textSize2XL]"
        >
          Sin publicaciones
        </h6>

        <p
          class="font-quicksand sm:px-5"
          :class="[useStyles().textColorSecondary, useStyles().textSizeBase]"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste enim accusamus earum
          expedita.
        </p>

        <!-- Confirm -->
        <UButton
          :to="{ name: 'insert' }"
          label="Publicar"
          variant="solid"
          size="md"
          :ui="useUIConfigs().acceptButtonConfig"
          class="w-min font-quicksand font-bold"
          @click="onCloseModal"
        />
      </div>

      <!-- Posts -->
      <div
        v-else-if="status === 'success' && data && data.posts.length > 0"
        class="flex flex-col gap-y-3 sm:gap-y-5 lg:gap-y-7"
      >
        <!-- Hero -->
        <div class="flex items-center justify-between">
          <h6
            class="font-ubuntu font-semibold leading-none"
            :class="[useStyles().textColorPrimary, useStyles().textSize2XL]"
          >
            Tus Anuncios
          </h6>

          <!-- Count -->
          <span
            v-if="userStore.user?.type === 'agent'"
            :class="[useStyles().textColorPrimary, useStyles().textSizeBase]"
            >{{ data.posts.length }}/35</span
          >
        </div>

        <!-- Cards -->
        <div class="grid-template flex w-full flex-col gap-4 sm:grid sm:justify-center lg:gap-6">
          <CardMinimalPost
            v-for="post in data.posts"
            :key="post.id"
            :post="post"
            @close-modal="onCloseModal"
            @post-deleted="onPostDeleted"
          />
        </div>
      </div>
    </UContainer>
  </UModal>
</template>

<style lang="css" scoped>
@media (min-width: 640px) {
  .grid-template {
    grid-template-columns: repeat(2, minmax(253px, 1fr));
  }
}
</style>
