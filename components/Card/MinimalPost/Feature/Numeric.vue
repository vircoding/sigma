<script setup lang="ts">
const props = defineProps<{
  count: number;
  color: string;
}>();
</script>

<template>
  <aside class="flex items-center gap-x-1 md:gap-x-2">
    <!-- Icon -->
    <div
      class="h-5 w-5 md:h-6 md:w-6"
      :class="[
        props.count !== 0
          ? `text-${props.color}-500 dark:text-${props.color}-400`
          : useStyles().textColorDisabledSecondary,
      ]"
    >
      <slot name="icon" />
    </div>

    <!-- Count -->
    <span
      class="font-semibold"
      :class="[
        useStyles().textSizeBase,
        props.count !== 0 ? useStyles().textColorSecondary : useStyles().textColorDisabledSecondary,
      ]"
      >x{{ props.count }}</span
    >
  </aside>
</template>
