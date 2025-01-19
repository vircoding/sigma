<script setup lang="ts">
const props = defineProps<{
  name: string;
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
    label="Correo Electrónico"
    name="email"
    :error="(valOnChange || props.errorVisibility) && errorMessage"
    class="mb-4"
  >
    <template #label="{ label, error }">
      <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
    </template>

    <template #default="{ error }">
      <UInput
        v-model.trim="value"
        size="md"
        type="email"
        autocomplete="email"
        inputmode="email"
        :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
        @blur="valOnChange = true"
      />
    </template>

    <template #error="{ error }">
      <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
        {{ error }}
      </span>
    </template>
  </UFormGroup>
</template>
