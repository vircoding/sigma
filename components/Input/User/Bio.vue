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
    label="Biografía (Opcional)"
    name="bio"
    :error="(valOnChange || props.errorVisibility) && errorMessage"
  >
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
        >{{ value.length }}/250<span class="hidden min-[414px]:inline"> caracteres</span></span
      >
    </template>

    <template #default="{ error }">
      <UTextarea
        v-model.trim="value"
        placeholder="Sin Biografía"
        size="md"
        :rows="9"
        type="text"
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
