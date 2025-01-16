<script setup lang="ts">
const props = defineProps<{
  label: string;
  state: boolean;
}>();
</script>

<template>
  <div class="flex flex-col gap-y-0.5">
    <span
      class="font-bold text-azure-950 lg:text-gray-500 dark:text-gray-200 lg:dark:text-gray-400"
      :class="[useStyles().textSizeLG]"
      >{{ props.label }}</span
    >

    <aside class="flex items-center gap-x-1.5">
      <!-- Icon -->
      <div
        class="h-9 w-9 md:h-11 md:w-11"
        :class="[
          props.state ? 'text-primary-500 dark:text-primary-400' : useStyles().textColorDisabled,
        ]"
      >
        <slot name="icon" />
      </div>

      <!-- Count -->
      <UIcon
        v-if="props.state"
        name="i-charm-tick"
        class="h-6 w-6"
        :class="[useStyles().textColorSecondary]"
      />
      <UIcon v-else name="i-charm-minus" class="h-6 w-6" :class="[useStyles().textColorDisabled]" />
    </aside>
  </div>
</template>
