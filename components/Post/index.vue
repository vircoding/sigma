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
    <!-- Gallery -->
    <div class="absolute left-[0vw] top-[72px] w-screen sm:top-[84px] md:top-24">
      <PostGallery :images="props.post.images" />
    </div>

    <!-- Details -->
    <div class="flex flex-col pt-[calc(100vw/1.78)]">
      <!-- Hero -->
      <section class="flex flex-col pt-3 md:pt-5">
        <!-- Top -->
        <div
          class="flex items-center justify-between font-ubuntu"
          :class="[useStyles().textColorPrimary]"
        >
          <!-- Sale Info -->
          <PostDetailsSale v-if="props.post.type === 'sale'" v-bind="props.post.details" />

          <!-- Rent Info -->
          <PostDetailsRent v-else-if="props.post.type === 'rent'" v-bind="props.post.details" />

          <!-- Exchange Info -->
          <PostDetailsExchange
            v-else-if="props.post.type === 'exchange'"
            v-bind="props.post.details"
          />

          <!-- CTA's -->
          <div class="flex items-center gap-x-1">
            <!-- Edit -->
            <NuxtLink
              v-if="isOwn"
              :to="{ name: 'update-post-id', params: { id: props.post.id } }"
              class="flex items-center"
            >
              <UIcon
                name="i-solar-pen-bold"
                class="h-[30px] w-[30px] md:h-[38px] md:w-[38px]"
                :class="[useStyles().textColorPrimary]"
              />
            </NuxtLink>

            <!-- Share -->
            <ButtonIcon @click="$emit('share')">
              <UIcon
                name="i-solar-share-bold"
                class="h-8 w-8 md:h-10 md:w-10"
                :class="[useStyles().textColorPrimary]"
              />
            </ButtonIcon>
          </div>
        </div>
      </section>

      <!-- Properties -->
      <div v-for="(property, index) in props.post.properties" :key="index">
        <aside
          v-if="props.post.type === 'exchange' && props.post.details.offers > 1"
          :class="{ 'pt-3 md:pt-5': index >= 1 }"
        >
          <span
            class="font-bold leading-none"
            :class="[useStyles().textColorPrimary, useStyles().textSizeLG]"
            >Propiedad {{ index + 1 }}</span
          >
        </aside>

        <!-- Address -->
        <aside class="pb-3 md:pb-5">
          <span>{{ property.address.municipality }}, {{ property.address.province }}</span>
        </aside>

        <!-- Divider -->
        <UDivider type="dashed" />

        <!-- Features -->
        <PostFeatures :features="property.features" />

        <!-- Divider -->
        <UDivider type="dashed" />
      </div>

      <!-- Description -->
      <section class="py-3.5 md:py-[22px]">
        <p class="whitespace-pre-wrap">
          {{ props.post.description.length === 0 ? 'Sin Descripción :(' : props.post.description }}
        </p>
      </section>

      <!-- Divider -->
      <UDivider type="dashed" />

      <!-- Agent Details -->
      <PostAuthor v-if="props.post.author.agent" v-bind="props.post.author.agent" />
    </div>

    <!-- Phone Actions -->
    <section class="sticky bottom-3 z-50 md:bottom-5">
      <PostPhone v-bind="{ ...props.post.contact, id: props.post.id }" />
    </section>
  </div>
</template>
