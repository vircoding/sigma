<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

const { id } = useRoute().params;
const { setUIPrimary, resetUIPrimary } = useGlobal();
const { user } = useUserStore();

const { status, data, error } = useLazyFetch(`/api/posts/${id}`);

const isFormVisible = ref(false);

async function onStatus() {
  if (status.value === 'success' && data.value) {
    if (user?.id !== data.value.post.author.authorId) {
      await navigateTo({ name: 'index' });
    } else {
      setUIPrimary(data.value.post.type);
      isFormVisible.value = true;
    }
  } else if (status.value === 'error' && error.value) {
    if (error.value.statusCode === 404 && error.value.data.message === 'Post not found') {
      showError(createError({ status: 404 }));
    } else showError(createError({ status: 500 }));
  }
}

watch(status, () => {
  onStatus();
});

onMounted(() => {
  onStatus();
});

onBeforeRouteLeave(() => {
  resetUIPrimary();
});
</script>

<template>
  <UContainer :class="[useStyles().pageContainer]">
    <!-- Skeleton -->
    <div v-if="!isFormVisible">
      <SkeletonUpdatePost />
    </div>

    <!-- Post Info -->
    <div v-else-if="isFormVisible && data">
      <!-- Sale -->
      <FormUpdatePostSale v-if="data.post.type === 'sale'" :id="id as string" :post="data.post" />

      <!-- Rent -->
      <FormUpdatePostRent
        v-else-if="data.post.type === 'rent'"
        :id="id as string"
        :post="data.post"
      />

      <!-- Exchange -->
      <FormUpdatePostExchange
        v-else-if="data.post.type === 'exchange'"
        :id="id as string"
        :post="data.post"
      />
    </div>
  </UContainer>
</template>
