<script setup lang="ts">
const props = defineProps<{
  label: string;
  count: number;
}>();
</script>

<template>
  <div class="flex flex-col gap-y-0.5">
    <span class="font-bold" :class="[useStyles().textColorPrimary, useStyles().textSizeLG]">{{
      props.label
    }}</span>

    <aside class="flex items-center gap-x-2">
      <!-- Icon -->
      <div
        class="h-9 w-9"
        :class="[
          props.count !== 0
            ? 'text-primary-500 dark:text-primary-400'
            : useStyles().textColorDisabled,
        ]"
      >
        <slot name="icon" />
      </div>

      <!-- Count -->
      <span
        class="font-bold"
        :class="[
          useStyles().textSizeXL,
          props.count !== 0 ? useStyles().textColorSecondary : useStyles().textColorDisabled,
        ]"
        >x{{ props.count }}</span
      >
    </aside>
  </div>
</template>
