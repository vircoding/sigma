<script setup lang="ts">
import type { Code } from '~/models/types/Post';

const props = defineProps<{
  code: string;
  codeName: string;
  labelAttrib: string;
  phone: string;
  phoneName: string;
  errorVisibility: boolean;
}>();

const countries = useCountries().countries;
const valOnChange = ref(false);

const { value: codeValue } = useField<string>(() => props.codeName, undefined, {
  syncVModel: 'code',
  validateOnMount: true,
});

const { value: phoneValue, errorMessage: phoneErrorMessage } = useField<string>(
  () => props.phoneName,
  undefined,
  {
    syncVModel: 'phone',
    validateOnMount: true,
  },
);

function getCode() {
  const country = countries.find((country) => country.callingCode === codeValue.value);
  if (country) return country;
  else throw showError(createError({ status: 500 }));
}

watch(codeValue, () => {
  codeState.value = getCode();
});

const codeState = ref<Code>(getCode());

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

function onCodeChange() {
  codeValue.value = codeState.value.callingCode;
  valOnChange.value = true;
}
</script>

<template>
  <div class="flex justify-between gap-x-2">
    <!-- Code -->
    <UFormGroup
      size="md"
      :label="props.labelAttrib"
      name="phone"
      :error="(valOnChange || props.errorVisibility) && phoneErrorMessage"
    >
      <template #label="{ label, error }">
        <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
      </template>

      <template #default="{ error }">
        <USelectMenu
          v-model.trim="codeState"
          :searchable="search"
          placeholder="Código del país"
          :options="countries"
          clear-search-on-close
          selected-icon="i-solar-check-circle-bold"
          :ui="useUIConfigs().countrySelectConfig"
          :ui-menu="useUIConfigs().countrySelectMenuConfig"
          searchable-placeholder="Código del país"
          @change="onCodeChange"
        >
          <template #label>
            <div class="flex items-center gap-2">
              <div class="flex min-h-4 min-w-5 overflow-hidden rounded-sm">
                <img
                  :src="`https://flagcdn.com/w20/${codeState.code}.png`"
                  :srcset="`https://flagcdn.com/w40/${codeState.code}.png 2x`"
                  width="20"
                  alt="Cayman Islands"
                />
              </div>
              <div class="flex w-min min-w-9 justify-center">
                <span>+{{ codeState.callingCode }}</span>
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
      :error="(valOnChange || props.errorVisibility) && phoneErrorMessage"
      class="relative top-5 w-full md:top-[22px]"
    >
      <template #default="{ error }">
        <UInput
          v-model.trim="phoneValue"
          size="md"
          type="tel"
          :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
          @blur="valOnChange = true"
        />
      </template>

      <template #error></template>
    </UFormGroup>
  </div>
</template>
