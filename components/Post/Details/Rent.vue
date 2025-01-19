<script setup lang="ts">
const props = defineProps<{
  tax: number;
  currency: 'USD' | 'CUP';
  frequency: 'daily' | 'monthly';
}>();

const { formatAmount } = usePost();

const formattedFrequency = computed(() => (props.frequency === 'daily' ? 'día' : 'mes'));
</script>

<template>
  <aside>
    <span class="font-black" :class="[useStyles().textSize3XL]"
      >{{ formatAmount(props.tax) }}
      <span class="font-semibold" :class="[useStyles().textSizeXL]"
        >{{ props.currency }} / {{ formattedFrequency }}</span
      ></span
    >
  </aside>
</template>
