<script setup lang="ts">
import type { PostType } from '~/models/types/Post';

const props = defineProps<{
  name: string;
  modelValue: PostType;
}>();

const { $listen } = useNuxtApp();
const { setInsertType } = useGlobalStore();

const { value } = useField<PostType>(() => props.name, undefined, {
  syncVModel: true,
});

const state = ref(0);

$listen('navigation:insert', (type) => {
  switch (type) {
    case 'rent':
      value.value = 'rent';
      appConfig.ui.primary = 'keppel';
      break;
    case 'exchange':
      value.value = 'exchange';
      appConfig.ui.primary = 'affair';
      break;
    default:
      value.value = 'sale';
      appConfig.ui.primary = 'azure';
      break;
  }
});

watch(value, () => {
  switch (value.value) {
    case 'rent':
      state.value = 1;
      break;
    case 'exchange':
      state.value = 2;
      break;
    default:
      state.value = 0;
      break;
  }
});

const appConfig = useAppConfig();

const items = [
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

function onChange(index: number) {
  switch (index) {
    case 1:
      value.value = 'rent';
      appConfig.ui.primary = 'keppel';
      setInsertType('rent');
      break;
    case 2:
      value.value = 'exchange';
      appConfig.ui.primary = 'affair';
      setInsertType('exchange');
      break;
    default:
      value.value = 'sale';
      appConfig.ui.primary = 'azure';
      setInsertType('sale');
      break;
  }
}
</script>

<template>
  <UTabs
    v-model="state"
    :items="items"
    :default-index="0"
    :ui="{ wrapper: 'space-y-3.5' }"
    @change="onChange"
  >
    <template #icon="{ item, selected }">
      <UIcon
        :name="item.icon"
        class="me-1 hidden h-5 w-5 flex-shrink-0 min-[413px]:block md:me-2 md:h-6 md:w-6"
        :class="[
          selected ? 'text-primary-500 dark:text-primary-400' : useStyles().textColorSecondary,
        ]"
      />
    </template>

    <template #default="{ item, selected }">
      <span
        class="truncate text-sm font-semibold min-[341px]:text-base md:text-lg"
        :class="[
          selected ? 'text-primary-500 dark:text-primary-400' : useStyles().textColorSecondary,
        ]"
        >{{ item.label }}</span
      >
    </template>

    <template #item="{ item }">
      <!-- Sale -->
      <div v-if="item.key === 'sale'" class="flex">
        <!-- Amount -->
        <div class="mb-4 w-[45%] max-w-64 min-[340px]:w-[43%] min-[345px]:w-[41%]">
          <slot name="sale-amount" />
        </div>

        <!-- Currency -->
        <div
          class="relative top-7 flex h-min flex-grow items-center justify-center gap-x-2 min-[345px]:gap-x-3 min-[365px]:gap-x-4 min-[385px]:gap-x-5"
        >
          <slot name="sale-currency" />
        </div>
      </div>

      <!-- Rent -->
      <div v-if="item.key === 'rent'" class="flex">
        <!-- Tax -->
        <div class="mb-4 w-[45%] max-w-64 min-[340px]:w-[43%] min-[345px]:w-[41%]">
          <slot name="rent-tax" />
        </div>

        <div
          class="relative top-[18px] flex h-min flex-grow items-center justify-center gap-x-1 min-[330px]:gap-x-2 min-[345px]:gap-x-3 min-[365px]:gap-x-4 min-[385px]:gap-x-5 md:top-[14px]"
        >
          <!-- Currency -->
          <div class="flex flex-col">
            <slot name="rent-currency" />
          </div>

          <!-- Frequency -->
          <div class="flex flex-col">
            <slot name="rent-frequency" />
          </div>
        </div>
      </div>

      <!-- Exchange -->
      <div
        v-if="item.key === 'exchange'"
        class="flex flex-col items-center gap-x-3 min-[395px]:flex-row"
      >
        <!-- Offers -->
        <div class="mb-4 w-full">
          <slot name="exchange-offers" />
        </div>

        <!-- Needs -->
        <div class="mb-4 w-full">
          <slot name="exchange-needs" />
        </div>
      </div>
    </template>
  </UTabs>
</template>
