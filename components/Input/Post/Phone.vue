<script setup lang="ts">
import { z, ZodError } from 'zod';
import parsePhoneNumber from 'libphonenumber-js';

type Code = {
  code: string;
  esName: string;
  enName: string;
  callingCode: string;
};

const countries = useCountries().countries;

const code = ref<Code>(countries[0]);
const phoneModel = defineModel<string>('phone', { required: true });

const schema = z
  .object({
    code: z
      .string({ message: 'Requerido' })
      .trim()
      .refine(
        (data) => {
          const regex = /^\+\d+$/;
          if (data.length > 3) return false;
          if (!regex.test(`+${data}`)) return false;
          return true;
        },
        { message: 'El código no es válido' },
      ),
    phone: z.string({ message: 'Requerido' }).trim().min(1, 'Requerido'),
  })
  .refine(
    (data) => {
      const parsedPhoneNumber = parsePhoneNumber(`+${data.code}${data.phone}`);
      if (!parsedPhoneNumber?.isValid()) return false;
      else return true;
    },
    {
      message: 'Debe ser un teléfono válido',
      path: ['phone'],
    },
  );

const errors = computed<{
  error: boolean;
  message?: string;
}>(() => {
  try {
    schema.parse({ code: code.value.callingCode, phone: phoneModel.value });

    return { error: false };
  } catch (error) {
    if (error instanceof ZodError) {
      const fields = error.errors.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      const phoneErrors = fields.filter(
        (value) => value.field === 'phone' || value.field === 'code',
      );

      return { error: phoneErrors.length !== 0, message: phoneErrors[0]?.message };
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
  <div class="mb-2.5 flex justify-between gap-x-3">
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
          v-model.trim="code"
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
                  :src="`https://flagcdn.com/w20/${code.code}.png`"
                  :srcset="`https://flagcdn.com/w40/${code.code}.png 2x`"
                  width="20"
                  alt="Cayman Islands"
                />
              </div>
              <div class="flex w-min min-w-9 justify-center">
                <span>+{{ code.callingCode }}</span>
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
          v-model.trim="phoneModel"
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
