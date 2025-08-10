<script setup lang="ts">
const props = defineProps<{
  post: SearchResult;
}>();

const { setPostPagePostType } = useUIStore();
const { getColorByPostType } = useUIConfig();

const color = computed(() => getColorByPostType(props.post.type));

async function onNavigate(id: string, type: PostType) {
  setPostPagePostType(type);
  navigateTo({ name: 'posts-id', params: { id } });
}
</script>

<template>
  <button
    type="button"
    class="w-full max-w-96 overflow-hidden rounded-2xl md:max-w-none"
    @click="onNavigate(post.id, post.type)"
  >
    <!-- Card -->
    <div class="flex w-full flex-col bg-gray-100 shadow-sm dark:bg-gray-800">
      <!-- Images -->
      <aside class="relative">
        <img :src="props.post.images[0]" />
      </aside>

      <!-- Bottom -->
      <div class="relative flex h-[88px] justify-between md:h-[102px]">
        <!-- Details -->
        <CardFullPostDetails :post="props.post" />

        <!-- Exchange Multi-Offer Features -->
        <CardFullPostFeatureMulti
          v-if="props.post.type === 'exchange' && props.post.details.offers > 1"
          :post="props.post"
        />

        <!-- Features -->
        <div v-else class="flex flex-grow flex-col items-center justify-center">
          <CardFullPostFeature
            :features="props.post.properties[0].features"
            :gap-compress="false"
            :color="color"
          />
        </div>
      </div>
    </div>
  </button>
</template>
