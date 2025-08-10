<script setup lang="ts">
const props = defineProps<{
  name: string;
  errorVisibility: boolean;
}>();

defineModel<string>('password', { required: true });
const passwordVisibility = defineModel<boolean>('passwordVisibility', { default: false });

const valOnChange = ref(false);

const { value, errorMessage } = useField<string>(() => props.name, undefined, {
  syncVModel: 'password',
  validateOnMount: true,
});
</script>

<template>
  <UFormGroup
    size="md"
    label="Contraseña"
    name="password"
    :error="(valOnChange || props.errorVisibility) && errorMessage"
  >
    <template #label="{ label, error }">
      <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
    </template>

    <template #default="{ error }">
      <UInput
        v-model.trim="value"
        size="md"
        :type="passwordVisibility ? 'text' : 'password'"
        @blur="valOnChange = true"
      >
        <template #trailing>
          <UIcon
            v-if="error"
            name="i-heroicons-exclamation-circle"
            class="mr-2 h-5 w-5 md:h-6 md:w-6"
            :class="[useStyles().textColorError]"
          />
          <UIcon
            name="i-solar-eye-broken"
            class="z-10 h-5 w-5 cursor-pointer md:h-6 md:w-6"
            :class="[
              error ? useStyles().textColorError : useStyles().textColorPrimary,
              passwordVisibility ? 'hidden' : undefined,
            ]"
            @click="passwordVisibility = true"
          />
          <UIcon
            name="i-solar-eye-closed-broken"
            class="relative top-0.5 z-10 h-5 w-5 cursor-pointer md:h-6 md:w-6"
            :class="[
              error ? useStyles().textColorError : useStyles().textColorPrimary,
              !passwordVisibility ? 'hidden' : undefined,
            ]"
            @click="passwordVisibility = false"
          />
        </template>
      </UInput>
    </template>

    <template #error="{ error }">
      <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
        {{ error }}
      </span>
    </template>
  </UFormGroup>
</template>
