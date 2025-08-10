<script setup lang="ts">
const props = defineProps<{
  state: boolean;
  color: string;
}>();
</script>

<template>
  <aside class="flex items-center gap-x-1 md:gap-x-1.5">
    <!-- Icon -->
    <div
      class="h-5 w-5 md:h-6 md:w-6"
      :class="[
        props.state
          ? `text-${props.color}-500 dark:text-${props.color}-400`
          : useStyles().textColorDisabledSecondary,
      ]"
    >
      <slot name="icon" class="h-5 w-5" />
    </div>

    <!-- True Icon -->
    <UIcon
      v-if="props.state"
      name="i-charm-tick"
      class="h-4 w-4 md:h-5 md:w-5"
      :class="[useStyles().textColorSecondary]"
    />

    <!-- False Icon -->
    <UIcon
      v-else
      name="i-charm-minus"
      class="h-4 w-4 md:h-5 md:w-5"
      :class="[useStyles().textColorDisabledSecondary]"
    />
  </aside>
</template>
