<script setup lang="ts">
import {
  insertSaleSchema,
  insertRentSchema,
  getInsertExchangeSchema,
} from '~/models/schemas/client/InsertSchema';
import type { InsertSchema } from '~/models/schemas/client/InsertSchema';
import { PROVINCES } from '~/models/types/Post';
import type { InsertInput } from '~/models/types/Post';
import {
  AccessTokenExpiredError,
  FormFieldError,
  BadRequestError,
  ClientMaxError,
  AgentMaxError,
  MaxImageSizeError,
} from '~/models/classes/client/Error';

defineEmits<{
  (e: 'agent'): void;
}>();

const globalStore = useGlobalStore();

const { refresh } = useAuth();
const { insert } = usePost();
const { openSubmitLoading, closeSubmitLoading, setUIPrimary } = useGlobal();
const toast = useToast();

const imagesInput = useTemplateRef('imagesInput');
const badRequestErrorModal = useTemplateRef('badRequest');
const clientMaxErrorModal = useTemplateRef('clientMax');
const agentMaxErrorModal = useTemplateRef('agentMax');

const errorVisibility = ref(false);

const state = reactive<InsertInput>({
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
    code: '53',
  },
  whatsapp: true,
  properties: [
    {
      address: {
        province: PROVINCES['La Habana'],
        municipality: 'La Habana Vieja',
      },
      features: {
        bed: '0',
        bath: '0',
        backyard: false,
        balcony: false,
        garage: false,
        pool: false,
      },
    },
    {
      address: {
        province: PROVINCES['La Habana'],
        municipality: 'La Habana Vieja',
      },
      features: {
        bed: '0',
        bath: '0',
        backyard: false,
        balcony: false,
        garage: false,
        pool: false,
      },
    },
    {
      address: {
        province: PROVINCES['La Habana'],
        municipality: 'La Habana Vieja',
      },
      features: {
        bed: '0',
        bath: '0',
        backyard: false,
        balcony: false,
        garage: false,
        pool: false,
      },
    },
  ],
  images: [],
  description: '',
});

const { handleSubmit, setFieldError, isSubmitting } = useForm<InsertSchema>({
  validationSchema: computed(() => {
    switch (state.type) {
      case 'rent':
        return toTypedSchema(insertRentSchema);
      case 'exchange':
        return toTypedSchema(getInsertExchangeSchema(state.exchange.offers));
      default:
        return toTypedSchema(insertSaleSchema);
    }
  }),
});

const onSubmit = handleSubmit(
  async (values) => {
    try {
      openSubmitLoading();

      const data = await insert(values);
      await navigateTo({ name: 'posts-id', params: { id: data.postId } });
      toast.add({
        timeout: 4000,
        title: 'Auncio Publicado',
      });
    } catch (error) {
      if (error instanceof AccessTokenExpiredError) {
        await refresh().catch(() => showError(createError({ status: 500 })));
        onSubmit();
      } else if (error instanceof BadRequestError || error instanceof FormFieldError) {
        badRequestErrorModal.value?.openModal();
      } else if (error instanceof MaxImageSizeError) {
        setFieldError('images', 'La imagen es muy grande');
        imagesInput.value?.setBackendError(error.index);
      } else if (error instanceof ClientMaxError) {
        clientMaxErrorModal.value?.openModal();
      } else if (error instanceof AgentMaxError) {
        agentMaxErrorModal.value?.openModal();
      } else {
        showError(createError({ status: 500 }));
      }
    } finally {
      closeSubmitLoading();
    }
  },
  () => {
    errorVisibility.value = true;
  },
);

onMounted(() => {
  state.type = globalStore.insertType;
  setUIPrimary(state.type);
});
</script>

<template>
  <UForm :state="state" @submit="onSubmit">
    <div class="auto-cols-auto grid-cols-2 grid-rows-1 lg:grid lg:gap-x-12 xl:gap-x-20">
      <!-- Left Column -->
      <div class="col-start-1 row-start-1 self-center">
        <div class="top-0 mb-4 flex-col gap-5 lg:flex">
          <!-- Hero -->
          <section class="mb-5 flex flex-col gap-2 lg:mb-0">
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
          <section class="mb-7 flex flex-col lg:mb-0">
            <button
              type="button"
              class="w-min text-nowrap font-medium"
              :class="[useStyles().linkActiveState]"
              @click.prevent="$emit('agent')"
            >
              Contactar agente
            </button>
          </section>
        </div>
      </div>

      <!-- Right Column -->
      <div class="col-start-2 row-start-1 self-center">
        <!-- Type Selector -->
        <InputPostType v-model="state.type" name="type">
          <!-- Sale Amount -->
          <template #sale-amount>
            <InputPostAmount
              v-model="state.sale.amount"
              :error-visibility="errorVisibility"
              name="saleAmount"
              label-attrib="Precio"
            />
          </template>

          <!-- Sale Currency -->
          <template #sale-currency>
            <InputPostCurrency v-model="state.sale.currency" name="saleCurrency" />
          </template>

          <!-- Rent Tax -->
          <template #rent-tax>
            <InputPostAmount
              v-model="state.rent.tax"
              :error-visibility="errorVisibility"
              name="rentTax"
              label-attrib="Tarifa"
            />
          </template>

          <!-- Rent Currency -->
          <template #rent-currency>
            <InputPostCurrency v-model="state.rent.currency" name="rentCurrency" />
          </template>

          <!-- Rent Frequency -->
          <template #rent-frequency>
            <InputPostFrequency v-model="state.rent.frequency" name="rentFrequency" />
          </template>

          <!-- Exchange Offers -->
          <template #exchange-offers>
            <InputPostOffers v-model="state.exchange.offers" name="exchangeOffers" />
          </template>

          <!-- Exchange Needs -->
          <template #exchange-needs>
            <InputPostNeeds v-model="state.exchange.needs" name="exchangeNeeds" />
          </template>
        </InputPostType>

        <!-- Phone Number -->
        <InputPhone
          v-model:code="state.phone.code"
          v-model:phone="state.phone.phone"
          :error-visibility="errorVisibility"
          label-attrib="Teléfono"
          code-name="phone.code"
          phone-name="phone.phone"
          class="mb-1.5"
        />

        <!-- Whatsapp Checkbox -->
        <div class="mb-4 pl-2">
          <InputCheckbox
            v-model="state.whatsapp"
            label="Contactar por Whatsapp"
            name="whatsapp"
            name-attrib="whatsapp"
          />
        </div>
      </div>
    </div>

    <!-- Properties -->
    <div v-for="(_, index) in state.properties" :key="`property-${index + 1}`">
      <div
        v-if="(state.type === 'exchange' && index <= state.exchange.offers - 1) || index === 0"
        class="mb-4 flex flex-col gap-x-3 rounded-xl border border-gray-300 px-3 pb-3 pt-4 lg:flex-row lg:px-5 lg:pt-[18px] dark:border-gray-700"
      >
        <!-- Address -->
        <InputPostAddress
          v-model:province="state.properties[index].address.province"
          v-model:municipality="state.properties[index].address.municipality"
          :index="index"
          :province-name="`properties[${index}].address.province`"
          :municipality-name="`properties[${index}].address.municipality`"
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
                :error-visibility="errorVisibility"
                :name="`properties[${index}].features.bed`"
                label-attrib="Cuartos"
              />
            </div>

            <!-- Bath -->
            <div class="mb-2.5 w-full">
              <InputPostFeature
                v-model="state.properties[index].features.bath"
                :error-visibility="errorVisibility"
                :name="`properties[${index}].features.bath`"
                label-attrib="Baños"
              />
            </div>
          </div>

          <!-- Checkboxes -->
          <div
            class="flex w-min max-w-xs flex-col flex-wrap place-content-center gap-x-0 lg:w-full lg:flex-row"
          >
            <!-- Backyard -->
            <div class="mb-2 lg:min-w-[125px]">
              <InputCheckbox
                v-model="state.properties[index].features.backyard"
                label="Patio"
                :name="`properties[${index}].features.backyard`"
                :name-attrib="`backyard-${index + 1}`"
              />
            </div>

            <!-- Balcony -->
            <div class="mb-2 lg:min-w-[125px]">
              <InputCheckbox
                v-model="state.properties[index].features.balcony"
                label="Balcón"
                :name="`properties[${index}].features.balcony`"
                :name-attrib="`balcony-${index + 1}`"
              />
            </div>

            <!-- Garage -->
            <div class="mb-2 lg:min-w-[125px]">
              <InputCheckbox
                v-model="state.properties[index].features.garage"
                label="Garage"
                :name="`properties[${index}].features.garage`"
                :name-attrib="`garage-${index + 1}`"
              />
            </div>

            <!-- Pool -->
            <div class="mb-2 lg:min-w-[125px]">
              <InputCheckbox
                v-model="state.properties[index].features.pool"
                label="Piscina"
                :name="`properties[${index}].features.pool`"
                :name-attrib="`pool-${index + 1}`"
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
        <InputPostImage
          ref="imagesInput"
          v-model="state.images"
          name="images"
          :error-visibility="errorVisibility"
        />
      </div>

      <!-- Right -->
      <div class="flex w-full flex-col items-center lg:min-w-[408px] lg:max-w-[488px]">
        <!-- Description -->
        <div class="mb-6 w-full">
          <InputPostDescription
            v-model="state.description"
            :error-visibility="errorVisibility"
            name="description"
          />
        </div>

        <!-- Submit -->
        <UButton
          type="submit"
          size="md"
          block
          :disabled="isSubmitting"
          :ui="useUIConfigs().acceptButtonConfig"
          class="font-bold"
          >Publicar</UButton
        >
      </div>
    </div>

    <!-- Bad Request Error -->
    <ModalMinimalError
      ref="badRequest"
      title="Error de solicitud"
      body="Estamos afrontando dificultades para procesar tu solicitud. Por favor, refresca esta página e inténtalo más tarde."
    />

    <!-- Client Max Error -->
    <ModalMinimalError
      ref="clientMax"
      title="Límite de publicaciones"
      body="Las cuentas de propietarios están limitadas a solo una publicación. Si quieres publicar otros anuncios deberás cambiar a una cuenta de Agente."
    />

    <!-- Agent Max Error -->
    <ModalMinimalError
      ref="agentMax"
      title="Límite de publicaciones"
      body="Las cuentas de propietarios están limitadas a 35 publicaciones. Para poder publicar otros anuncios deberás eliminar alguno de los existentes."
    />
  </UForm>
</template>
