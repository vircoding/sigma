<script setup lang="ts">
import type { PostType } from '~/models/PostTypes';
import type { SaleDetails, RentDetails, ExchangeDetails, Details } from '~/server/models/Types';

const props = defineProps<{
  type: PostType;
  details: Details;
  isOwn: boolean;
  postId: string;
}>();

const { fullPath } = useRoute();

function onShare() {
  const shareData = {
    title: 'Publicación en Sigma',
    text: 'Mira esta casa',
    url: fullPath,
  };

  navigator.share(shareData).catch();
}
</script>

<template>
  <section class="flex flex-col pt-3 md:pt-5 lg:pb-[18px]">
    <!-- Top -->
    <div
      class="flex items-center justify-between font-ubuntu"
      :class="[useStyles().textColorPrimary]"
    >
      <!-- Sale Info -->
      <PostDetailsSale v-if="props.type === 'sale'" v-bind="props.details as SaleDetails" />

      <!-- Rent Info -->
      <PostDetailsRent v-else-if="props.type === 'rent'" v-bind="props.details as RentDetails" />

      <!-- Exchange Info -->
      <PostDetailsExchange
        v-else-if="props.type === 'exchange'"
        v-bind="props.details as ExchangeDetails"
      />

      <!-- CTA's -->
      <div class="flex items-center gap-x-1">
        <!-- Edit -->
        <NuxtLink
          v-if="props.isOwn"
          :to="{ name: 'update-post-id', params: { id: props.postId } }"
          class="flex items-center"
        >
          <UIcon
            name="i-solar-pen-bold"
            class="h-[30px] w-[30px] md:h-[38px] md:w-[38px]"
            :class="[useStyles().textColorPrimary]"
          />
        </NuxtLink>

        <!-- Share -->
        <ButtonIcon @click="onShare">
          <UIcon
            name="i-solar-share-bold"
            class="h-8 w-8 md:h-10 md:w-10"
            :class="[useStyles().textColorPrimary]"
          />
        </ButtonIcon>
      </div>
    </div>
  </section>
</template>
