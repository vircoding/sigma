<script setup lang="ts">
import { ZodError } from 'zod';
import { insertSchema } from '~/models/ValSchema';

const appConfig = useAppConfig();

type BackendErrorField =
  | 'amount'
  | 'tax'
  | 'phone'
  | 'description'
  | 'bed0'
  | 'bed1'
  | 'bed2'
  | 'bath0'
  | 'bath1'
  | 'bath2'
  | 'images';

type Province =
  | 'Pinar del Río'
  | 'Artemisa'
  | 'La Habana'
  | 'Mayabeque'
  | 'Matanzas'
  | 'Villa Clara'
  | 'Cienfuegos'
  | 'Sancti Spíritus'
  | 'Ciego de Ávila'
  | 'Camagüey'
  | 'Las Tunas'
  | 'Holguín'
  | 'Granma'
  | 'Santiago de Cuba'
  | 'Guantánamo'
  | 'Isla de la Juventud';

const countries = useCountries().countries;

const provinces = useProvinces().getProvinces();
const { getMunicipalitiesByProvince, defaultMunicipality } = useProvinces();

const tabsItems = [
  {
    key: 'sale',
    label: 'Venta',
    icon: 'i-solar:bag-check-broken',
  },
  {
    key: 'rent',
    label: 'Renta',
    icon: 'i-solar-hand-money-broken',
  },
  {
    key: 'exchange',
    label: 'Permuta',
    icon: 'i-solar-notes-minimalistic-broken',
  },
];

const currencyMethods = [
  { value: 'USD', label: 'USD' },
  { value: 'CUP', label: 'CUP' },
];

const frequencyMethods = [
  { value: 'daily', label: 'Diario' },
  { value: 'monthly', label: 'Mensual' },
];

const offersOptions = [
  { value: 1, label: '1 Propiedad' },
  { value: 2, label: '2 Propiedades' },
  { value: 3, label: '3 Propiedades' },
];

const needsOptions = [
  { value: 0, label: 'Sin especificar' },
  { value: 1, label: '1 Propiedad' },
  { value: 2, label: '2 Propiedades' },
  { value: 3, label: '3 Propiedades' },
];

type ErrorItem = {
  error: boolean;
  message?: string;
};

const backendErrors = ref<{
  amount: boolean;
  tax: boolean;
  phone: boolean;
  description: boolean;
  properties: {
    bed: boolean;
    bath: boolean;
  }[];
  images: boolean;
}>({
  amount: false,
  tax: false,
  phone: false,
  description: false,
  images: false,
  properties: [
    {
      bed: false,
      bath: false,
    },
    {
      bed: false,
      bath: false,
    },
    {
      bed: false,
      bath: false,
    },
  ],
});

const errors = computed<{
  amount: ErrorItem;
  tax: ErrorItem;
  phone: ErrorItem;
  description: ErrorItem;
  properties: {
    bed: ErrorItem;
    bath: ErrorItem;
  }[];
}>(() => {
  try {
    const success = {
      amount: { error: false },
      tax: { error: false },
      phone: { error: false },
      description: { error: false },
      properties: [
        {
          bed: { error: false },
          bath: { error: false },
        },
        {
          bed: { error: false },
          bath: { error: false },
        },
        {
          bed: { error: false },
          bath: { error: false },
        },
      ],
    };

    const input = {
      amount: Number(saleState.amount),
      tax: Number(rentState.tax),
      code: code.value.callingCode,
      phone: phone.value,
      description: state.value.description,
      properties: state.value.properties.map((item) => ({
        bed: Number(item.features.bed),
        bath: Number(item.features.bath),
      })),
      images: images.value.map((item) => item.imageURL || ''),
    };

    insertSchema.parse(input);

    return success;
  } catch (error) {
    if (error instanceof ZodError) {
      const fields = error.errors.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      const amountErrors = fields.filter((value) => value.field === 'amount');
      const taxErrors = fields.filter((value) => value.field === 'tax');

      const phoneErrors = fields.filter(
        (value) => value.field === 'phone' || value.field === 'code',
      );
      const descriptionErrors = fields.filter((value) => value.field === 'description');
      const bed0Errors = fields.filter((value) => value.field === 'properties.0.bed');
      const bath0Errors = fields.filter((value) => value.field === 'properties.0.bath');
      const bed1Errors = fields.filter((value) => value.field === 'properties.1.bed');
      const bath1Errors = fields.filter((value) => value.field === 'properties.1.bath');
      const bed2Errors = fields.filter((value) => value.field === 'properties.2.bed');
      const bath2Errors = fields.filter((value) => value.field === 'properties.2.bath');

      return {
        amount: { error: amountErrors.length !== 0, message: amountErrors[0]?.message },
        tax: { error: taxErrors.length !== 0, message: taxErrors[0]?.message },
        phone: { error: phoneErrors.length !== 0, message: phoneErrors[0]?.message },
        description: {
          error: descriptionErrors.length !== 0,
          message: descriptionErrors[0]?.message,
        },
        properties: [
          {
            bed: { error: bed0Errors.length !== 0, message: bed0Errors[0]?.message },
            bath: { error: bath0Errors.length !== 0, message: bath0Errors[0]?.message },
          },
          {
            bed: { error: bed1Errors.length !== 0, message: bed1Errors[0]?.message },
            bath: { error: bath1Errors.length !== 0, message: bath1Errors[0]?.message },
          },
          {
            bed: { error: bed2Errors.length !== 0, message: bed2Errors[0]?.message },
            bath: { error: bath2Errors.length !== 0, message: bath2Errors[0]?.message },
          },
        ],
      };
    }

    return {
      amount: { error: true },
      tax: { error: true },
      phone: { error: true },
      description: { error: true },
      properties: [
        {
          bed: { error: true },
          bath: { error: true },
        },
        {
          bed: { error: true },
          bath: { error: true },
        },
        {
          bed: { error: true },
          bath: { error: true },
        },
      ],
    };
  }
});

const errorVisibility = ref({
  amount: false,
  tax: false,
  phone: false,
  description: false,
});

const type = ref<'sale' | 'rent' | 'exchange'>('sale');

const images = ref<
  {
    imageURL: string | undefined;
    blob: Blob | undefined;
  }[]
>([
  {
    imageURL: undefined,
    blob: undefined,
  },
]);

const state = ref<{
  description: string;
  whatsapp: boolean;
  properties: {
    address: {
      province: Province;
      municipality: string;
    };
    features: {
      bed: string;
      bath: string;
      garage: boolean;
      garden: boolean;
      pool: boolean;
      furnished: boolean;
    };
  }[];
}>({
  description: '',
  whatsapp: true,
  properties: [
    {
      address: {
        province: 'La Habana',
        municipality: 'La Habana Vieja',
      },
      features: {
        bed: '0',
        bath: '0',
        garage: false,
        garden: false,
        pool: false,
        furnished: false,
      },
    },
    {
      address: {
        province: 'La Habana',
        municipality: 'La Habana Vieja',
      },
      features: {
        bed: '0',
        bath: '0',
        garage: false,
        garden: false,
        pool: false,
        furnished: false,
      },
    },
    {
      address: {
        province: 'La Habana',
        municipality: 'La Habana Vieja',
      },
      features: {
        bed: '0',
        bath: '0',
        garage: false,
        garden: false,
        pool: false,
        furnished: false,
      },
    },
  ],
});

const saleState = reactive({
  amount: '',
  currency: 'USD',
});

const rentState = reactive({
  tax: '',
  currency: 'USD',
  frequency: 'daily',
});

const exchangeState = ref({
  offers: offersOptions[0],
  needs: needsOptions[1],
});

const phone = ref('');
const code = ref<{
  code: string;
  esName: string;
  enName: string;
  callingCode: string;
}>(countries[0]);

function onTypeChange(index: number) {
  switch (index) {
    case 1:
      type.value = 'rent';
      break;
    case 2:
      type.value = 'exchange';
      break;
    default:
      type.value = 'sale';
      break;
  }
}

const textColor = computed(() => {
  switch (type.value) {
    case 'rent':
      return 'text-keppel-500 dark:text-keppel-400';
    case 'exchange':
      return 'text-affair-500 dark:text-affair-400';
    default:
      return 'text-azure-500 dark:text-azure-400';
  }
});

watch(type, () => {
  switch (type.value) {
    case 'rent':
      appConfig.ui.primary = 'keppel';
      break;
    case 'exchange':
      appConfig.ui.primary = 'affair';
      break;
    default:
      appConfig.ui.primary = 'azure';
      break;
  }
});

watch(code, () => {
  resetBackendError('phone');
});

function resetBackendError(field: BackendErrorField) {
  switch (field) {
    case 'bed0':
      backendErrors.value.properties[0].bed = false;
      break;
    case 'bed1':
      backendErrors.value.properties[1].bed = false;
      break;
    case 'bed2':
      backendErrors.value.properties[2].bed = false;
      break;
    case 'bath0':
      backendErrors.value.properties[0].bath = false;
      break;
    case 'bath1':
      backendErrors.value.properties[1].bath = false;
      break;
    case 'bath2':
      backendErrors.value.properties[2].bath = false;
      break;
    default:
      backendErrors.value[field] = false;
      break;
  }
}

function getBedKey(index: 0 | 1 | 2) {
  switch (index) {
    case 0:
      return 'bed0';
    case 1:
      return 'bed1';
    case 2:
      return 'bed2';
  }
}

function getBathKey(index: 0 | 1 | 2) {
  switch (index) {
    case 0:
      return 'bath0';
    case 1:
      return 'bath1';
    case 2:
      return 'bath2';
  }
}

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

function onProvinceChange(index: number) {
  if ([0, 1, 2].includes(index)) {
    state.value.properties[index].address.municipality = defaultMunicipality(
      state.value.properties[index].address.province,
    );
  } else showError(createError({ status: 500 }));
}

function onAgent() {
  console.log('Agent Event');
}

function onImagePush() {
  images.value.push({
    imageURL: undefined,
    blob: undefined,
  });
}

async function onSubmit() {
  console.log('Form submitted');
}

onUnmounted(() => {
  appConfig.ui.primary = 'azure';
});
</script>

<template>
  <UContainer class="w-full" :class="[useStyles().pageContainer]">
    <div class="lg:hidden">
      <!-- Hero -->
      <section class="mb-7 flex flex-col gap-2">
        <h2
          class="font-ubuntu font-bold"
          :class="[useStyles().textColorPrimary, useStyles().textSize4XL]"
        >
          Publicar anuncio
        </h2>
        <p>
          Completa el formulario para llegar a potenciales compradores. Si necesitas ayuda, puedes
          contactar a nuestros agentes especializados.
        </p>
      </section>
    </div>

    <!-- Form -->
    <UForm :state="state" @submit="onSubmit">
      <!-- Top -->
      <div class="auto-cols-auto grid-cols-2 grid-rows-1 lg:grid lg:gap-x-12 xl:gap-x-20">
        <!-- Left Column -->
        <div class="col-start-1 row-start-1 self-center">
          <div class="top-0 mb-4 hidden flex-col gap-5 lg:flex">
            <!-- Hero -->
            <section class="flex flex-col gap-2">
              <h2
                class="font-ubuntu font-bold"
                :class="[useStyles().textColorPrimary, useStyles().textSize4XL]"
              >
                Publicar anuncio
              </h2>
              <p>
                Completa el formulario para llegar a potenciales compradores. Si necesitas ayuda,
                puedes contactar a nuestros agentes especializados.
              </p>
            </section>

            <!-- Desktop CTA's -->
            <section class="hidden flex-col lg:flex">
              <button
                class="w-min text-nowrap font-medium"
                :class="[useStyles().linkActiveState, useStyles().textSizeBase]"
                @click="onAgent"
              >
                Contactar agente
              </button>
            </section>
          </div>
        </div>

        <!-- Right Column -->
        <div class="col-start-2 row-start-1 self-center">
          <!-- Type -->
          <UTabs
            :items="tabsItems"
            :default-index="0"
            :ui="{ wrapper: 'space-y-3.5' }"
            @change="onTypeChange"
          >
            <template #icon="{ item, selected }">
              <UIcon
                :name="item.icon"
                class="me-1 hidden h-5 w-5 flex-shrink-0 min-[413px]:block md:me-2 md:h-6 md:w-6"
                :class="[selected ? textColor : useStyles().textColorSecondary]"
              />
            </template>

            <template #default="{ item, selected }">
              <span
                class="truncate text-sm font-semibold min-[341px]:text-base md:text-lg"
                :class="[selected ? textColor : useStyles().textColorSecondary]"
                >{{ item.label }}</span
              >
            </template>

            <template #item="{ item }">
              <!-- Sale -->
              <div v-if="item.key === 'sale'" class="flex items-center">
                <!-- Amount -->
                <UFormGroup
                  size="md"
                  label="Precio"
                  name="amount"
                  :error="
                    (backendErrors.amount && 'Debe ser un precio válido') ||
                    (errors.amount.error && errorVisibility.amount && errors.amount.message)
                  "
                  class="mb-4 w-[45%] max-w-64 min-[340px]:w-[43%] min-[345px]:w-[41%]"
                >
                  <template #label="{ label, error }">
                    <span :class="[error ? useStyles().textColorError : undefined]">{{
                      label
                    }}</span>
                  </template>

                  <template #default="{ error }">
                    <UInput
                      v-model.trim="saleState.amount"
                      size="md"
                      type="text"
                      :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
                      @input="resetBackendError('amount')"
                      @blur="errorVisibility.amount = true"
                    />
                  </template>

                  <template #error="{ error }">
                    <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
                      {{ error }}
                    </span>
                  </template>
                </UFormGroup>

                <!-- Currency -->
                <div
                  class="flex flex-grow items-center justify-center gap-x-2 min-[345px]:gap-x-3 min-[365px]:gap-x-4 min-[385px]:gap-x-5"
                >
                  <URadio
                    v-for="method of currencyMethods"
                    :key="method.value"
                    v-model="saleState.currency"
                    v-bind="method"
                    :ui="{ wrapper: 'relative flex items-center ', inner: 'ms-1.5' }"
                  >
                    <template #label>
                      <span
                        class="relative font-medium leading-none"
                        :class="[useStyles().textSizeBase]"
                        >{{ method.label }}</span
                      >
                    </template>
                  </URadio>
                </div>
              </div>

              <!-- Rent -->
              <div v-if="item.key === 'rent'" class="flex items-center">
                <!-- Amount -->
                <UFormGroup
                  size="md"
                  label="Tarifa"
                  name="tax"
                  :error="
                    (backendErrors.tax && 'Debe ser un precio válido') ||
                    (errors.tax.error && errorVisibility.tax && errors.tax.message)
                  "
                  class="mb-4 w-[45%] max-w-64 min-[340px]:w-[43%] min-[345px]:w-[41%]"
                >
                  <template #label="{ label, error }">
                    <span :class="[error ? useStyles().textColorError : undefined]">{{
                      label
                    }}</span>
                  </template>

                  <template #default="{ error }">
                    <UInput
                      v-model.trim="rentState.tax"
                      size="md"
                      type="text"
                      :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
                      @input="resetBackendError('tax')"
                      @blur="errorVisibility.tax = true"
                    />
                  </template>

                  <template #error="{ error }">
                    <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
                      {{ error }}
                    </span>
                  </template>
                </UFormGroup>

                <div
                  class="flex flex-grow items-center justify-center gap-x-1 min-[330px]:gap-x-2 min-[345px]:gap-x-3 min-[365px]:gap-x-4 min-[385px]:gap-x-5"
                >
                  <!-- Currency -->
                  <div class="flex flex-col">
                    <URadio
                      v-for="method of currencyMethods"
                      :key="method.value"
                      v-model="rentState.currency"
                      v-bind="method"
                      :ui="{
                        wrapper: 'relative flex items-center ',
                        inner: 'ms-1.5',
                        color: 'text-keppel-500 dark:text-keppel-400',
                        ring: 'focus-visible:ring-keppel-500 dark:focus-visible:ring-keppel-400',
                      }"
                    >
                      <template #label>
                        <span
                          class="relative font-medium leading-none"
                          :class="[useStyles().textSizeBase]"
                          >{{ method.label }}</span
                        >
                      </template>
                    </URadio>
                  </div>

                  <!-- Frequency -->
                  <div class="flex flex-col">
                    <URadio
                      v-for="method of frequencyMethods"
                      :key="method.value"
                      v-model="rentState.frequency"
                      v-bind="method"
                      :ui="{
                        wrapper: 'relative flex items-center ',
                        inner: 'ms-1.5',
                        color: 'text-keppel-500 dark:text-keppel-400',
                        ring: 'focus-visible:ring-keppel-500 dark:focus-visible:ring-keppel-400',
                      }"
                    >
                      <template #label>
                        <span
                          class="relative font-medium leading-none"
                          :class="[useStyles().textSizeBase]"
                          >{{ method.label }}</span
                        >
                      </template>
                    </URadio>
                  </div>
                </div>
              </div>

              <!-- Exchange -->
              <div
                v-if="item.key === 'exchange'"
                class="flex flex-col items-center gap-x-3 min-[395px]:flex-row"
              >
                <!-- Offers -->
                <UFormGroup
                  size="md"
                  label="Ofreces"
                  name="offers"
                  :error="false"
                  class="mb-4 w-full"
                >
                  <template #label="{ label, error }">
                    <span :class="[error ? useStyles().textColorError : undefined]">{{
                      label
                    }}</span>
                  </template>

                  <template #default>
                    <USelectMenu
                      v-model="exchangeState.offers"
                      selected-icon="i-solar-check-circle-bold"
                      :options="offersOptions"
                      :ui="{
                        color: {
                          white: { outline: 'focus:ring-affair-500 dark:focus:ring-affair-400' },
                        },
                        variant: {
                          outline:
                            'ring-affair-500 dark:ring-affair-400 focus:ring-affair-500 dark:focus:ring-affair-400',
                        },
                      }"
                      :ui-menu="{
                        option: {
                          base: 'cursor-pointer',
                          selectedIcon: {
                            base: `${useStyles().textColorPrimary}`,
                          },
                        },
                        select: 'cursor-pointer',
                        popper: {
                          placement: 'bottom-start',
                        },
                      }"
                    >
                      <template #label>
                        <span :class="[useStyles().textSizeBase, useStyles().textColorPrimary]">{{
                          exchangeState.offers.label
                        }}</span>
                      </template>

                      <template #trailing>
                        <UIcon
                          name="i-heroicons-chevron-down-20-solid"
                          class="h-5 w-5"
                          :class="[useStyles().textColorPrimary]"
                        />
                      </template>
                    </USelectMenu>
                  </template>

                  <template #error="{ error }">
                    <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
                      {{ error }}
                    </span>
                  </template>
                </UFormGroup>

                <!-- Needs -->
                <UFormGroup
                  size="md"
                  label="Necesitas"
                  name="needs"
                  :error="false"
                  class="mb-4 w-full"
                >
                  <template #label="{ label, error }">
                    <span :class="[error ? useStyles().textColorError : undefined]">{{
                      label
                    }}</span>
                  </template>

                  <template #default>
                    <USelectMenu
                      v-model="exchangeState.needs"
                      selected-icon="i-solar-check-circle-bold"
                      :options="needsOptions"
                      :ui="{
                        color: {
                          white: { outline: 'focus:ring-affair-500 dark:focus:ring-affair-400' },
                        },
                        variant: {
                          outline:
                            'ring-affair-500 dark:ring-affair-400 focus:ring-affair-500 dark:focus:ring-affair-400',
                        },
                      }"
                      :ui-menu="{
                        option: {
                          base: 'cursor-pointer',
                          selectedIcon: {
                            base: `${useStyles().textColorPrimary}`,
                          },
                        },
                        select: 'cursor-pointer',
                        popper: {
                          placement: 'bottom-start',
                        },
                      }"
                    >
                      <template #label>
                        <span
                          :class="[
                            useStyles().textSizeBase,
                            exchangeState.needs.value === 0
                              ? 'text-gray-500 dark:text-gray-400'
                              : useStyles().textColorPrimary,
                          ]"
                          >{{ exchangeState.needs.label }}</span
                        >
                      </template>

                      <template #trailing>
                        <UIcon
                          name="i-heroicons-chevron-down-20-solid"
                          class="h-5 w-5"
                          :class="[useStyles().textColorPrimary]"
                        />
                      </template>
                    </USelectMenu>
                  </template>

                  <template #error="{ error }">
                    <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
                      {{ error }}
                    </span>
                  </template>
                </UFormGroup>
              </div>
            </template>
          </UTabs>

          <!-- Phone Number -->
          <div class="mb-2.5 flex justify-between gap-x-3">
            <!-- Code -->
            <UFormGroup
              size="md"
              label="Teléfono"
              name="phone"
              :error="
                (backendErrors.phone && 'Debe ser un teléfono válido') ||
                (errors.phone.error && errorVisibility.phone && errors.phone.message)
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
                (backendErrors.phone && 'Debe ser un teléfono válido') ||
                (errors.phone.error && errorVisibility.phone && errors.phone.message)
              "
              class="relative top-5 w-full md:top-[22px]"
            >
              <template #default="{ error }">
                <UInput
                  v-model.trim="phone"
                  size="md"
                  type="tel"
                  :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
                  @input="resetBackendError('phone')"
                  @blur="errorVisibility.phone = true"
                />
              </template>

              <template #error></template>
            </UFormGroup>
          </div>

          <!-- Whatsapp Checkbox -->
          <div class="pl-2">
            <UCheckbox
              v-model="state.whatsapp"
              name="whatsapp"
              class="mb-4"
              :ui="useUIConfigs().checkboxConfig"
            >
              <template #label>
                <span class="relative font-medium leading-none" :class="[useStyles().textSizeBase]"
                  >Contactar por Whatsapp</span
                >
              </template>
            </UCheckbox>
          </div>
        </div>
      </div>

      <!-- Properties -->
      <div v-for="(property, index) in state.properties" :key="index">
        <div
          v-if="(type === 'exchange' && index <= exchangeState.offers.value - 1) || index === 0"
          class="mb-4 flex flex-col gap-x-3 rounded-xl border border-gray-300 px-3 pb-3 pt-4 lg:flex-row lg:px-5 lg:pt-[18px] dark:border-gray-700"
        >
          <!-- Address -->
          <div class="w-full place-content-center lg:max-w-sm">
            <!-- Province -->
            <UFormGroup
              size="md"
              label="Provincia"
              :name="`province-${index + 1}`"
              :error="false"
              class="mb-4 w-full"
            >
              <template #label="{ label, error }">
                <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
              </template>

              <template #default>
                <USelectMenu
                  v-model="property.address.province"
                  selected-icon="i-solar-check-circle-bold"
                  :options="provinces"
                  :ui-menu="{
                    option: {
                      base: 'cursor-pointer',
                      selectedIcon: {
                        base: `${useStyles().textColorPrimary}`,
                      },
                    },
                    select: 'cursor-pointer',
                    popper: {
                      placement: 'bottom-start',
                    },
                  }"
                  @change="onProvinceChange(index)"
                >
                  <template #label>
                    <span :class="[useStyles().textSizeBase, useStyles().textColorPrimary]">{{
                      property.address.province
                    }}</span>
                  </template>

                  <template #trailing>
                    <UIcon
                      name="i-heroicons-chevron-down-20-solid"
                      class="h-5 w-5"
                      :class="[useStyles().textColorPrimary]"
                    />
                  </template>
                </USelectMenu>
              </template>

              <template #error="{ error }">
                <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
                  {{ error }}
                </span>
              </template>
            </UFormGroup>

            <!-- Municipality -->
            <UFormGroup
              size="md"
              label="Municipio"
              :name="`municipality-${index + 1}`"
              :error="false"
              class="mb-4 w-full lg:mb-2.5"
            >
              <template #label="{ label, error }">
                <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
              </template>

              <template #default>
                <USelectMenu
                  v-model="property.address.municipality"
                  selected-icon="i-solar-check-circle-bold"
                  :options="getMunicipalitiesByProvince(property.address.province)"
                  :ui-menu="{
                    option: {
                      base: 'cursor-pointer',
                      selectedIcon: {
                        base: `${useStyles().textColorPrimary}`,
                      },
                    },
                    select: 'cursor-pointer',
                    popper: {
                      placement: 'bottom-start',
                    },
                  }"
                >
                  <template #label>
                    <span :class="[useStyles().textSizeBase, useStyles().textColorPrimary]">{{
                      property.address.municipality
                    }}</span>
                  </template>

                  <template #trailing>
                    <UIcon
                      name="i-heroicons-chevron-down-20-solid"
                      class="h-5 w-5"
                      :class="[useStyles().textColorPrimary]"
                    />
                  </template>
                </USelectMenu>
              </template>

              <template #error="{ error }">
                <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
                  {{ error }}
                </span>
              </template>
            </UFormGroup>
          </div>

          <div
            class="flex grow place-content-center items-center justify-evenly lg:justify-center lg:gap-x-5 xl:gap-x-10"
          >
            <!-- Feature Inputs -->
            <div class="w-min place-content-center">
              <!-- Bed -->
              <UFormGroup
                size="md"
                label="Cuartos"
                :name="`bed-${index + 1}`"
                :error="
                  (backendErrors.properties[index].bed && 'Entre 0 y 9') ||
                  (errors.properties[index].bed.error && errors.properties[index].bed.message)
                "
                class="mb-4 w-full"
              >
                <template #label="{ label, error }">
                  <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
                </template>

                <template #default>
                  <InputBed
                    v-model="property.features.bed"
                    :type="type"
                    @input="resetBackendError(getBedKey(index as 0 | 1 | 2))"
                  />
                </template>

                <template #error="{ error }">
                  <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
                    {{ error }}
                  </span>
                </template>
              </UFormGroup>

              <!-- Bath -->
              <UFormGroup
                size="md"
                label="Baños"
                :name="`bath-${index + 1}`"
                :error="
                  (backendErrors.properties[index].bath && 'Entre 0 y 9') ||
                  (errors.properties[index].bath.error && errors.properties[index].bath.message)
                "
                class="mb-2.5 w-full"
              >
                <template #label="{ label, error }">
                  <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
                </template>

                <template #default>
                  <InputBath
                    v-model="property.features.bath"
                    :type="type"
                    @input="resetBackendError(getBathKey(index as 0 | 1 | 2))"
                  />
                </template>

                <template #error="{ error }">
                  <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
                    {{ error }}
                  </span>
                </template>
              </UFormGroup>
            </div>

            <!-- Feature Checkboxes -->
            <div
              class="flex w-min max-w-xs flex-col flex-wrap place-content-center gap-x-0 lg:w-full lg:flex-row"
            >
              <!-- Garage -->
              <UCheckbox
                v-model="property.features.garage"
                name="garage"
                class="mb-2 lg:min-w-[125px]"
                :ui="useUIConfigs().checkboxConfig"
              >
                <template #label>
                  <span
                    class="relative font-medium leading-none"
                    :class="[useStyles().textSizeBase]"
                    >Garage</span
                  >
                </template>
              </UCheckbox>

              <!-- Garden -->
              <UCheckbox
                v-model="property.features.garden"
                name="garden"
                class="mb-2 lg:min-w-[125px]"
                :ui="useUIConfigs().checkboxConfig"
              >
                <template #label>
                  <span
                    class="relative font-medium leading-none"
                    :class="[useStyles().textSizeBase]"
                    >Jardín</span
                  >
                </template>
              </UCheckbox>

              <!-- Pool -->
              <UCheckbox
                v-model="property.features.pool"
                name="pool"
                class="mb-2 lg:min-w-[125px]"
                :ui="useUIConfigs().checkboxConfig"
              >
                <template #label>
                  <span
                    class="relative font-medium leading-none"
                    :class="[useStyles().textSizeBase]"
                    >Piscina</span
                  >
                </template>
              </UCheckbox>

              <!-- Furnished -->
              <UCheckbox
                v-model="property.features.furnished"
                name="furnished"
                class="mb-2 lg:min-w-[125px]"
                :ui="useUIConfigs().checkboxConfig"
              >
                <template #label>
                  <span
                    class="relative font-medium leading-none"
                    :class="[useStyles().textSizeBase]"
                    >Amueblada</span
                  >
                </template>
              </UCheckbox>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="flex flex-col items-center justify-center gap-x-5 lg:flex-row">
        <!-- Images -->
        <UFormGroup
          size="md"
          label="Imágenes (Mínimo 1)"
          name="images"
          :error="false"
          class="mb-4 w-full grow lg:mb-0"
        >
          <template #label="{ label, error }">
            <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
          </template>

          <template #hint="{ error }">
            <span
              class="mr-2"
              :class="[
                useStyles().textSizeXS,
                error ? useStyles().textColorError : useStyles().textColorPrimary,
              ]"
              >{{ images.length - 1 }}/10</span
            >
          </template>

          <template #default>
            <InputImage v-model="images" :type="type" @push="onImagePush" />
          </template>

          <template #error="{ error }">
            <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
              {{ error }}
            </span>
          </template>
        </UFormGroup>

        <!-- Right -->
        <div class="flex w-full flex-col items-center lg:min-w-[408px] lg:max-w-[488px]">
          <!-- Description -->
          <UFormGroup
            size="md"
            label="Descripción (Opcional)"
            name="description"
            :error="false"
            class="mb-6 w-full"
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
                >{{ state.description.length }}/1250<span class="hidden min-[414px]:inline">
                  caracteres</span
                ></span
              >
            </template>

            <template #default="{ error }">
              <UTextarea
                v-model.trim="state.description"
                placeholder="Sin Descripción"
                size="md"
                :rows="12"
                type="text"
                :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
              />
            </template>

            <template #error="{ error }">
              <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
                {{ error }}
              </span>
            </template>
          </UFormGroup>

          <!-- Submit -->
          <UButton
            type="submit"
            size="md"
            block
            :ui="useUIConfigs().acceptButtonConfig"
            class="font-bold"
            >Publicar</UButton
          >
        </div>
      </div>
    </UForm>
  </UContainer>
</template>
