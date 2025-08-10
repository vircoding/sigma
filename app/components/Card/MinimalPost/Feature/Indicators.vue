<script setup lang="ts">
const props = defineProps<{
  active: boolean;
}>();
</script>

<template>
  <div
    class="h-2 w-2 rounded-full border border-affair-500 md:h-2.5 md:w-2.5 dark:border-affair-400"
    :class="props.active ? 'bg-affair-500 dark:bg-affair-400' : 'bg-transparent'"
  ></div>
</template>
