<script setup lang="ts">
type PostType = 'sale' | 'rent' | 'exchange';

const appConfig = useAppConfig();

const model = defineModel<PostType>();

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
      model.value = 'rent';
      appConfig.ui.primary = 'keppel';
      break;
    case 2:
      model.value = 'exchange';
      appConfig.ui.primary = 'affair';
      break;
    default:
      model.value = 'sale';
      appConfig.ui.primary = 'azure';
      break;
  }
}

const textColor = computed(() => {
  switch (model.value) {
    case 'rent':
      return 'text-keppel-500 dark:text-keppel-400';
    case 'exchange':
      return 'text-affair-500 dark:text-affair-400';
    default:
      return 'text-azure-500 dark:text-azure-400';
  }
});

onUnmounted(() => {
  appConfig.ui.primary = 'azure';
});
</script>

<template>
  <UTabs :items="items" :default-index="0" :ui="{ wrapper: 'space-y-3.5' }" @change="onChange">
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
      <div v-if="item.key === 'sale'" class="flex">
        <!-- Amount -->
        <div class="mb-4 w-[45%] max-w-64 min-[340px]:w-[43%] min-[345px]:w-[41%]">
          <slot name="sale-amount" />
        </div>

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
