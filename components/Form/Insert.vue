<script setup lang="ts">
import type { Insert } from '~/models/PostTypes';

defineEmits<{
  (e: 'agent'): void;
}>();

const state = reactive<Insert>({
  type: 'sale',
  sale: {
    amount: '',
    currency: 'USD',
  },
  rent: {
    tax: '',
    currency: 'USD',
    frequency: 'daily',
  },
  exchange: {
    offers: 1,
    needs: 1,
  },
  phone: {
    phone: '',
    code: 'cu',
  },
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
  images: [],
  description: '',
});

async function onSubmit() {
  console.log('Form Submitted');
}
</script>

<template>
  <UForm :state="state" @submit="onSubmit">
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
              @click="$emit('agent')"
            >
              Contactar agente
            </button>
          </section>
        </div>
      </div>

      <!-- Right Column -->
      <div class="col-start-2 row-start-1 self-center">
        <!-- Type Selector -->
        <InputPostType v-model="state.type">
          <!-- Sale Amount -->
          <template #sale-amount>
            <InputPostAmount v-model="state.sale.amount" />
          </template>

          <!-- Sale Currency -->
          <template #sale-currency>
            <InputPostCurrency v-model="state.sale.currency" />
          </template>

          <!-- Rent Tax -->
          <template #rent-tax>
            <InputPostTax v-model="state.rent.tax" />
          </template>

          <!-- Rent Currency -->
          <template #rent-currency>
            <InputPostCurrency v-model="state.rent.currency" />
          </template>

          <!-- Rent Frequency -->
          <template #rent-frequency>
            <InputPostFrequency v-model="state.rent.frequency" />
          </template>

          <!-- Exchange Offers -->
          <template #exchange-offers>
            <InputPostOffers v-model="state.exchange.offers" />
          </template>

          <!-- Exchange Needs -->
          <template #exchange-needs>
            <InputPostNeeds v-model="state.exchange.needs" />
          </template>
        </InputPostType>

        <!-- Phone Number -->
        <InputPostPhone v-model:code="state.phone.code" v-model:phone="state.phone.phone" />

        <!-- Whatsapp Checkbox -->
        <div class="mb-4 pl-2">
          <InputCheckbox v-model="state.whatsapp" name="whatsapp" label="Contactar por Whatsapp" />
        </div>
      </div>
    </div>

    <!-- Properties -->
    <div v-for="(property, index) in state.properties" :key="`property-${index + 1}`">
      <div
        v-if="(state.type === 'exchange' && index <= state.exchange.offers - 1) || index === 0"
        class="mb-4 flex flex-col gap-x-3 rounded-xl border border-gray-300 px-3 pb-3 pt-4 lg:flex-row lg:px-5 lg:pt-[18px] dark:border-gray-700"
      >
        <!-- Address -->
        <InputPostAddress
          v-model:province="state.properties[index].address.province"
          v-model:municipality="state.properties[index].address.municipality"
          :index="index"
        />

        <!-- Features -->
        <div
          class="flex grow place-content-center items-center justify-evenly lg:justify-center lg:gap-x-5 xl:gap-x-10"
        >
          <!-- Inputs -->
          <div class="w-min place-content-center">
            <!-- Bed -->
            <div class="mb-4 w-full">
              <InputPostFeature
                v-model="state.properties[index].features.bed"
                :name="`bed-${index + 1}`"
                label="Cuartos"
              />
            </div>

            <!-- Bath -->
            <div class="mb-2.5 w-full">
              <InputPostFeature
                v-model="state.properties[index].features.bath"
                :name="`bath-${index + 1}`"
                label="Baños"
              />
            </div>
          </div>

          <!-- Checkboxes -->
          <div
            class="flex w-min max-w-xs flex-col flex-wrap place-content-center gap-x-0 lg:w-full lg:flex-row"
          >
            <!-- Garage -->
            <div class="mb-2 lg:min-w-[125px]">
              <InputCheckbox
                v-model="state.properties[index].features.garage"
                :name="`garage-${index + 1}`"
                label="Garage"
              />
            </div>

            <!-- Garden -->
            <div class="mb-2 lg:min-w-[125px]">
              <InputCheckbox
                v-model="state.properties[index].features.garden"
                :name="`garden-${index + 1}`"
                label="Jardín"
              />
            </div>

            <!-- Pool -->
            <div class="mb-2 lg:min-w-[125px]">
              <InputCheckbox
                v-model="state.properties[index].features.pool"
                :name="`pool-${index + 1}`"
                label="Piscina"
              />
            </div>

            <!-- Furnished -->
            <div class="mb-2 lg:min-w-[125px]">
              <InputCheckbox
                v-model="state.properties[index].features.furnished"
                :name="`furnished-${index + 1}`"
                label="Amueblada"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom -->
    <div class="flex flex-col items-center justify-center gap-x-5 lg:flex-row lg:items-start">
      <!-- Images -->
      <div class="mb-4 w-full grow lg:mb-0">
        <InputPostImage v-model="state.images" />
      </div>

      <!-- Right -->
      <div class="flex w-full flex-col items-center lg:min-w-[408px] lg:max-w-[488px]">
        <!-- Description -->
        <div class="mb-6 w-full">
          <InputPostDescription v-model="state.description" />
        </div>

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
</template>
