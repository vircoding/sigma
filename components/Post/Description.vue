<script setup lang="ts">
const props = defineProps<{
  description: string;
}>();
</script>

<template>
  <section class="py-3.5 md:py-[22px]">
    <p class="whitespace-pre-wrap">
      {{ props.description.length === 0 ? 'Sin Descripción :(' : props.description }}
    </p>
  </section>
</template>
