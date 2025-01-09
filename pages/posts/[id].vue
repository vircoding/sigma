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
    <!-- <div v-if="false">
      <SkeletonPost />
    </div>

    <div v-else>
      <Post :post="data.post" />
    </div> -->

    <div v-if="status === 'pending'">
      <SkeletonPost />
    </div>

    <div v-else-if="status === 'success' && data">
      <Post :post="data.post" @share="onShare" />
    </div>

    <!-- Phone Actions -->
    <!-- <section class="sticky bottom-[0vh] z-50 h-24 bg-black"></section> -->
  </UContainer>
</template>
