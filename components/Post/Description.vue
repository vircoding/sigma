<script setup lang="ts">
const props = defineProps<{
  description: string;
}>();
</script>

<template>
  <section class="flex py-3.5 md:py-[22px] lg:pb-0">
    <p class="max-h-[480px] w-full overflow-y-auto whitespace-pre-wrap lg:max-h-80">
      {{ props.description.length === 0 ? 'Sin Descripción :(' : props.description }}
    </p>
  </section>
</template>
