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
      class="h-6 w-6 md:h-7 md:w-7"
      :class="[
        props.state
          ? `text-${props.color}-500 dark:text-${props.color}-400`
          : useStyles().textColorDisabledSecondary,
      ]"
    >
      <slot name="icon" class="h-6 w-6" />
    </div>

    <!-- True Icon -->
    <UIcon
      v-if="props.state"
      name="i-charm-tick"
      class="h-5 w-5 md:h-6 md:w-6"
      :class="[useStyles().textColorSecondary]"
    />

    <!-- False Icon -->
    <UIcon
      v-else
      name="i-charm-minus"
      class="h-5 w-5 md:h-6 md:w-6"
      :class="[useStyles().textColorDisabledSecondary]"
    />
  </aside>
</template>
