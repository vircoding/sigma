<script setup lang="ts">
const props = defineProps<{
  name: string;
  label: string;
  nameAttrib: string;
  modelValue: boolean;
}>();

const { value, errorMessage } = useField<boolean>(() => props.name, undefined, {
  syncVModel: true,
});
</script>

<template>
  <UCheckbox v-model="value" :name="props.nameAttrib" :ui="useUIConfigs().checkboxConfig">
    <template #label>
      <span class="relative font-medium leading-none" :class="[useStyles().textSizeBase]">{{
        props.label
      }}</span>
    </template>
  </UCheckbox>
</template>
