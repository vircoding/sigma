<script setup lang="ts">
const props = defineProps<{
  label: string;
  count: number;
}>();
</script>

<template>
  <div class="flex flex-col gap-y-0.5">
    <span
      class="font-bold text-azure-950 lg:text-gray-500 dark:text-gray-200 lg:dark:text-gray-400"
      :class="[useStyles().textColorPrimary, useStyles().textSizeLG]"
      >{{ props.label }}</span
    >

    <aside class="flex items-center gap-x-2">
      <!-- Icon -->
      <div
        class="h-9 w-9 md:h-11 md:w-11"
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
        class="font-semibold"
        :class="[
          useStyles().textSizeXL,
          props.count !== 0 ? useStyles().textColorSecondary : useStyles().textColorDisabled,
        ]"
        >x{{ props.count }}</span
      >
    </aside>
  </div>
</template>
