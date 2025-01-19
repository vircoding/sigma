<script setup lang="ts">
definePageMeta({
  layout: 'post',
});

const { setUIPrimary, resetUIPrimary } = useGlobal();
const { params } = useRoute();

const { status, data, error } = await useLazyFetch(`/api/posts/${params.id}`);

function onStatus() {
  if (status.value === 'success' && data.value) {
    setUIPrimary(data.value.post.type);
  } else if (status.value === 'error' && error.value) {
    if (error.value.statusCode === 404 && error.value.data.message === 'Post not found') {
      showError(createError({ status: 404, message: 'Post not found' }));
    } else showError(createError({ status: 500 }));
  }
}

watch(status, () => {
  onStatus();
});

onMounted(() => {
  onStatus();
});

onUnmounted(() => {
  resetUIPrimary();
});
</script>

<template>
  <UContainer class="w-full px-0 min-[350px]:px-4" :class="[useStyles().pageContainer]">
    {{ error }}
    <!-- Skeleton -->
    <div v-if="status === 'pending'">
      <SkeletonPost />
    </div>

    <!-- Post Info -->
    <div v-else-if="status === 'success' && data">
      <Post :post="data.post" />
    </div>
  </UContainer>
</template>
