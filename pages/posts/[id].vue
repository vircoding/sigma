<script setup lang="ts">
definePageMeta({
  layout: 'post',
});

const appConfig = useAppConfig();
const { params, fullPath } = useRoute();

const { status, data } = useLazyFetch(`/api/posts/${params.id}`);

watch(data, (newData) => {
  if (newData) {
    switch (newData.post.type) {
      case 'rent':
        appConfig.ui.primary = 'keppel';
        break;
      case 'exchange':
        appConfig.ui.primary = 'affair';
        break;
      default:
        appConfig.ui.primary = 'azure';
        break;
    }
  }
});

function onShare() {
  const shareData = {
    title: 'Publicación en Sigma',
    text: 'Mira esta casa',
    url: fullPath,
  };

  navigator.share(shareData).catch();
}

onUnmounted(() => {
  appConfig.ui.primary = 'azure';
});
</script>

<template>
  <UContainer class="w-full" :class="[useStyles().pageContainer]">
    <!-- Skeleton -->
    <div v-if="status === 'pending'">
      <SkeletonPost />
    </div>

    <div v-else-if="status === 'success' && data">
      <!-- Post Info -->
      <Post :post="data.post" @share="onShare" />
    </div>
  </UContainer>
</template>
