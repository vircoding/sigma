<script setup lang="ts">
const props = defineProps<{
  tax: number;
  currency: 'USD' | 'CUP';
  frequency: 'daily' | 'monthly';
}>();
</script>

<template>
  <aside>
    <span class="font-black" :class="[useStyles().textSize3XL]"
      >{{ formatPostAmount(props.tax) }}
      <span class="font-semibold" :class="[useStyles().textSizeXL]"
        >{{ props.currency }} / {{ formatPostFrequency(props.frequency) }}</span
      ></span
    >
  </aside>
</template>
