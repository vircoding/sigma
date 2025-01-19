<script setup lang="ts">
definePageMeta({
  layout: 'post',
});
</script>

<template>
  <UContainer class="w-full px-0 min-[350px]:px-4" :class="[useStyles().pageContainer]">
    <SkeletonPost />
  </UContainer>
</template>
