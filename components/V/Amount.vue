<script setup lang="ts">
const props = defineProps<{
  name: string;
  labelAttrib: string;
  modelValue: string;
  errorVisibility: boolean;
}>();

const valOnChange = ref(false);

const { value, errorMessage } = useField<string>(() => props.name, undefined, {
  syncVModel: true,
  validateOnMount: true,
});
</script>

<template>
  <UFormGroup
    size="md"
    :label="props.labelAttrib"
    :name="props.name"
    :error="(valOnChange || props.errorVisibility) && errorMessage"
  >
    <template #label="{ label, error }">
      <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
    </template>

    <template #default="{ error }">
      <UInput
        v-model.trim="value"
        type="text"
        autocomplete="off"
        inputmode="numeric"
        size="md"
        :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
        @blur="valOnChange = true"
      />
    </template>

    <template #error="{ error }">
      <span class="text-nowrap" :class="[useStyles().textSizeSM, useStyles().textColorError]">
        {{ error }}
      </span>
    </template>
  </UFormGroup>
</template>
