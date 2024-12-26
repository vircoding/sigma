<script setup lang="ts">
const props = defineProps<{
  type: 'sale' | 'rent' | 'exchange';
}>();

const model = defineModel<string>();

const textAreaConfig = computed(() => {
  switch (props.type) {
    case 'rent':
      return useUIConfigs().inputRentConfig;
    case 'exchange':
      return useUIConfigs().inputExchangeConfig;
    default:
      return useUIConfigs().inputSaleConfig;
  }
});
</script>

<template>
  <UFormGroup size="md" label="Descripción (Opcional)" name="description" :error="false">
    <template #label="{ label, error }">
      <span class="h-min" :class="[error ? useStyles().textColorError : undefined]">{{
        label
      }}</span>
    </template>

    <template #hint="{ error }">
      <span
        class="mr-2"
        :class="[
          useStyles().textSizeXS,
          error ? useStyles().textColorError : useStyles().textColorPrimary,
        ]"
        >{{ model?.length }}/1250<span class="hidden min-[414px]:inline"> caracteres</span></span
      >
    </template>

    <template #default="{ error }">
      <UTextarea
        v-model.trim="model"
        placeholder="Sin Descripción"
        size="md"
        :rows="12"
        type="text"
        :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
        :ui="textAreaConfig"
      />
    </template>

    <template #error="{ error }">
      <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
        {{ error }}
      </span>
    </template>
  </UFormGroup>
</template>
