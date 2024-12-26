<script setup lang="ts">
type PostType = 'sale' | 'rent' | 'exchange';

defineEmits<{
  (e: 'agent'): void;
}>();

const state = reactive<{
  type: PostType;
  sale: {
    amount: string;
    currency: 'USD' | 'CUP';
  };
  rent: {
    tax: string;
    currency: 'USD' | 'CUP';
    frequency: 'daily' | 'monthly';
  };
  exchange: {
    offers: 1 | 2 | 3;
    needs: 0 | 1 | 2 | 3;
  };
  phone: {
    phone: string;
    code: string;
    whatsapp: boolean;
  };
}>({
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
    code: '+53',
    whatsapp: true,
  },
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
          <template #sale-amount>
            <InputPostAmount v-model="state.sale.amount" />
          </template>

          <template #sale-currency>
            <InputPostCurrency v-model="state.sale.currency" />
          </template>

          <template #rent-tax>
            <InputPostTax v-model="state.rent.tax" />
          </template>

          <template #rent-currency>
            <InputPostCurrency v-model="state.rent.currency" />
          </template>

          <template #rent-frequency>
            <InputPostFrequency v-model="state.rent.frequency" />
          </template>

          <template #exchange-offers>
            <InputPostOffers :init="1" @change="(value) => (state.exchange.offers = value)" />
          </template>

          <template #exchange-needs>
            <InputPostNeeds :init="1" @change="(value) => (state.exchange.needs = value)" />
          </template>
        </InputPostType>

        <!-- Phone Number -->
        <InputPostPhone />
      </div>
    </div>
  </UForm>
</template>
