<script setup lang="ts">
import { z, ZodError } from 'zod';

const countries = useCountries().countries;

const model = defineModel<{
  code: string;
  phone: string;
  whatsapp: boolean;
}>();

const schema = z
  .number({ message: 'Debe ser un precio válido' })
  .int('Debe ser un precio válido')
  .gte(1, 'Debe ser un precio válido')
  .lte(999999999, 'Debe ser un precio válido');

const errors = computed<{
  error: boolean;
  message?: string;
}>(() => {
  try {
    schema.parse(Number(model.value));

    return { error: false };
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.errors.map((issue) => issue.message);

      return { error: messages.length !== 0, message: messages[0] || '' };
    }

    return { error: true };
  }
});

const backendError = ref(false);
const errorVisibility = ref(false);

function removeAccents(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function search(q: string) {
  return countries.filter(
    (value) =>
      removeAccents(value.esName).toLowerCase().includes(removeAccents(q.toLowerCase())) ||
      removeAccents(value.enName).toLowerCase().includes(removeAccents(q.toLowerCase())) ||
      `+${value.callingCode}`.includes(q),
  );
}

defineExpose<{
  setBackendError: () => void;
  setErrorVisibility: () => void;
}>({
  setBackendError: function () {
    backendError.value = true;
  },

  setErrorVisibility: function () {
    errorVisibility.value = true;
  },
});
</script>

<template>
  <div v-if="model" class="mb-2.5 flex justify-between gap-x-3">
    <!-- Code -->
    <UFormGroup
      size="md"
      label="Teléfono"
      name="phone"
      :error="
        (backendError && 'Debe ser un teléfono válido') ||
        (errors.error && errorVisibility && errors.message)
      "
    >
      <template #label="{ label, error }">
        <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
      </template>

      <template #default="{ error }">
        <USelectMenu
          v-model.trim="model.code"
          :searchable="search"
          placeholder="Código del país"
          :options="countries"
          clear-search-on-close
          selected-icon="i-solar-check-circle-bold"
          :ui="useUIConfigs().countrySelectConfig"
          :ui-menu="useUIConfigs().countrySelectMenuConfig"
          searchable-placeholder="Código del país"
        >
          <template #label>
            <div class="flex items-center gap-2">
              <div class="flex min-h-4 min-w-5 overflow-hidden rounded-sm">
                <img
                  :src="`https://flagcdn.com/w20/${model.code.code}.png`"
                  :srcset="`https://flagcdn.com/w40/${model.code.code}.png 2x`"
                  width="20"
                  alt="Cayman Islands"
                />
              </div>
              <div class="flex w-min min-w-9 justify-center">
                <span>+{{ model.code.callingCode }}</span>
              </div>
            </div>
          </template>

          <template #trailing>
            <UIcon
              name="i-heroicons-chevron-down-20-solid"
              class="h-5 w-5"
              :class="[error ? useStyles().textColorError : useStyles().textColorPrimary]"
            />
          </template>

          <template #option="{ option }">
            <div class="flex min-h-4 min-w-5 overflow-hidden rounded-sm">
              <img
                :src="`https://flagcdn.com/w20/${option.code}.png`"
                :srcset="`https://flagcdn.com/w40/${option.code}.png 2x`"
                width="20"
                :alt="option.esName"
              />
            </div>
            <div class="w-min min-w-9">
              <span>+{{ option.callingCode }}</span>
            </div>
            <span class="truncate">{{ option.esName }}</span>
          </template>

          <template #option-empty="{ query }">
            <span :class="[useStyles().textColorSecondary, useStyles().textSizeXS]"
              >Sin resultados: <q>{{ query }}</q></span
            >
          </template>

          <template #empty
            ><span :class="[useStyles().textColorSecondary, useStyles().textSizeXS]"
              >Cargando...</span
            ></template
          >
        </USelectMenu>
      </template>

      <template #error="{ error }">
        <div class="relative h-4 md:h-[22px]">
          <span
            class="absolute text-nowrap"
            :class="[useStyles().textSizeSM, useStyles().textColorError]"
          >
            {{ error }}
          </span>
        </div>
      </template>
    </UFormGroup>

    <!-- Phone -->
    <UFormGroup
      size="md"
      name="phone"
      :error="
        (backendError && 'Debe ser un teléfono válido') ||
        (errors.error && errorVisibility && errors.message)
      "
      class="relative top-5 w-full md:top-[22px]"
    >
      <template #default="{ error }">
        <UInput
          v-model.trim="model.phone"
          size="md"
          type="tel"
          :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
          @input="backendError = false"
          @blur="errorVisibility = true"
        />
      </template>

      <template #error></template>
    </UFormGroup>
  </div>
</template>
