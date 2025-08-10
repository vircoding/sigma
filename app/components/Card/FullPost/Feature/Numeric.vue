<script setup lang="ts">
const props = defineProps<{
  count: number;
  color: string;
}>();
</script>

<template>
  <aside class="flex items-center gap-x-[7px] md:gap-x-[11px]">
    <!-- Icon -->
    <div
      class="h-6 w-6 md:h-7 md:w-7"
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
