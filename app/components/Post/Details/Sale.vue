<script setup lang="ts">
const props = defineProps<{
  amount: number;
  currency: 'USD' | 'CUP';
}>();
</script>

<template>
  <aside>
    <span class="font-black" :class="[useStyles().textSize3XL]"
      >{{ formatPostAmount(props.amount) }}
      <span class="font-semibold" :class="[useStyles().textSizeXL]">{{
        props.currency
      }}</span></span
    >
  </aside>
</template>
