<script setup lang="ts">
import type { PostData } from '~/server/models/Types';

defineEmits<{
  (e: 'share'): void;
}>();

const props = defineProps<{
  post: PostData;
}>();

const { user } = useUserStore();

const isOwn = computed(() => {
  return user?.id === props.post.author.authorId;
});
</script>

<template>
  <div class="flex flex-col">
    <!-- Mobile Gallery -->
    <div
      class="absolute left-[0vw] w-screen lg:hidden"
      :class="[
        $device.isMobileOrTablet
          ? 'top-[72px] sm:top-[84px] md:top-24'
          : 'top-[116px] sm:top-[128px] md:top-[143px]',
      ]"
    >
      <PostGallery :images="props.post.images" />
    </div>

    <div
      class="flex auto-cols-min grid-cols-2 grid-rows-1 flex-col pt-[calc(100vw/1.78)] lg:grid lg:items-center lg:gap-x-12 lg:pt-0"
    >
      <!-- Left Column (Desktop) -->
      <div>
        <!-- Desktop Gallery -->
        <PostGallery :images="props.post.images" class="hidden lg:block" />

        <!-- Details -->
        <PostDetails
          :is-own="isOwn"
          :type="props.post.type"
          :details="props.post.details"
          :post-id="props.post.id"
        />

        <!-- Desktop Divider -->
        <UDivider type="dashed" class="hidden lg:block" />

        <!-- Desktop Author -->
        <PostAuthor
          v-if="props.post.author.agent"
          v-bind="props.post.author.agent"
          class="hidden lg:block"
        />

        <!-- Desktop Phone -->
        <PostPhone v-bind="{ ...props.post.contact, id: props.post.id }" class="hidden lg:block" />
      </div>

      <!-- Right Column (Desktop) -->
      <div>
        <!-- Properties -->
        <PostProperties
          :properties="props.post.properties"
          :multiples="props.post.type === 'exchange' && props.post.details.offers > 1"
        />

        <!-- Description -->
        <PostDescription :description="props.post.description" />
      </div>

      <!-- Divider -->
      <UDivider type="dashed" class="lg:hidden" />

      <!-- Mobile Author -->
      <PostAuthor
        v-if="props.post.author.agent"
        v-bind="props.post.author.agent"
        class="lg:hidden"
      />
    </div>

    <!-- Mobile Phone -->
    <PostPhone v-bind="{ ...props.post.contact, id: props.post.id }" class="lg:hidden" />
  </div>
</template>
