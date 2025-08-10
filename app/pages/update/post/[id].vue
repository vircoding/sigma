<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

const { id } = useRoute().params;
const { user } = useUserStore();
const { setUpdatePagePostType } = useUIStore();

const isFormVisible = ref(false);
const { status, data, error } = useLazyFetch(`/api/posts/${id}`);

async function onStatus() {
  if (status.value === 'success' && data.value) {
    if (user?.id !== data.value.post.author.authorId) {
      await navigateTo({ name: 'index' });
    } else {
      setUpdatePagePostType(data.value.post.type);
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
