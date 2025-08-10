<script setup lang="ts">
definePageMeta({
  layout: 'post',
});

const { setPostPagePostType } = useUIStore();
const { id } = useRoute().params;

const { status, data, error } = useLazyFetch(`/api/posts/${id}`);

function onStatus() {
  if (status.value === 'success' && data.value) {
    setPostPagePostType(data.value.post.type);
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
</script>

<template>
  <UContainer class="w-full px-0 min-[350px]:px-4" :class="[useStyles().pageContainer]">
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
