<script setup lang="ts">
const props = defineProps<{
  post: UserPost;
}>();
</script>

<template>
  <!-- Sale -->
  <div
    v-if="props.post.type === 'sale'"
    class="flex h-full w-[94px] shrink-0 flex-col justify-center gap-y-0.5 bg-azure-500 text-center font-ubuntu md:w-[108px] dark:bg-azure-400"
  >
    <!-- Type -->
    <span
      class="relative top-0.5 mb-px font-bold leading-none md:leading-[22px]"
      :class="[useStyles().textColorCardHero, useStyles().textSizeLG]"
      >VENTA</span
    >

    <!-- Amount -->
    <span
      class="relative top-0.5 mb-0.5 font-semibold leading-none md:leading-[22px]"
      :class="[useStyles().textColorCardHero, useStyles().textSizeLG]"
      >{{ formatPostAmount(props.post.details.amount, true) }}</span
    >

    <!-- Currency -->
    <span
      class="relative top-0.5 leading-none md:leading-[22px]"
      :class="[useStyles().textColorCardHero, useStyles().textSizeSM]"
      >{{ props.post.details.currency }}</span
    >
  </div>

  <!-- Rent -->
  <div
    v-if="props.post.type === 'rent'"
    class="flex h-full w-[94px] shrink-0 flex-col justify-center gap-y-0.5 bg-keppel-500 text-center font-ubuntu md:w-[108px] dark:bg-keppel-400"
  >
    <!-- Type -->
    <span
      class="relative top-0.5 mb-px font-bold leading-none md:leading-[22px]"
      :class="[useStyles().textColorCardHero, useStyles().textSizeLG]"
      >RENTA</span
    >

    <!-- Tax -->
    <span
      class="relative top-0.5 mb-0.5 font-semibold leading-none md:leading-[22px]"
      :class="[useStyles().textColorCardHero, useStyles().textSizeLG]"
      >{{ formatPostAmount(props.post.details.tax, true) }}</span
    >

    <!-- Currency / Frequency -->
    <span
      class="relative top-0.5 leading-none md:leading-[22px]"
      :class="[useStyles().textColorCardHero, useStyles().textSizeSM]"
      >{{ props.post.details.currency }} /
      {{ formatPostFrequency(props.post.details.frequency) }}</span
    >
  </div>

  <!-- Exchange -->
  <div
    v-if="props.post.type === 'exchange'"
    class="flex h-full w-[94px] shrink-0 flex-col justify-center gap-y-0.5 bg-affair-500 text-center font-ubuntu md:w-[108px] dark:bg-affair-400"
  >
    <!-- Type -->
    <span
      class="relative top-0.5 mb-px font-bold leading-none md:leading-[22px]"
      :class="[useStyles().textColorCardHero, useStyles().textSizeLG]"
      >PERMUTA</span
    >

    <!-- Offers -->
    <span
      v-if="props.post.details.needs < 1"
      class="relative top-0.5 font-semibold leading-none md:leading-[22px]"
      :class="[useStyles().textColorCardHero, useStyles().textSizeLG]"
      >{{ props.post.details.offers }}
      <span :class="[useStyles().textColorCardHero, useStyles().textSizeSM]">{{
        props.post.details.offers === 1 ? 'prop.' : 'props.'
      }}</span></span
    >

    <!-- Offers w/ Needs -->
    <span
      v-else
      class="relative top-0.5 font-semibold leading-none md:leading-[22px]"
      :class="[useStyles().textColorCardHero, useStyles().textSizeLG]"
      >{{ props.post.details.offers }} x {{ props.post.details.needs }}</span
    >
  </div>
</template>
