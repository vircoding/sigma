<script setup lang="ts">
import {
  AccessTokenExpiredError,
  BadRequestError,
  MaxImageSizeError,
} from '~/models/classes/client/Error';
import { updateSaleSchema } from '~/models/schemas/client/UpdatePostSchema';
import type { UpdateSaleSchema } from '~/models/schemas/client/UpdatePostSchema';
import type { Map, Sale, UpdateSaleInput } from '~/models/types/Post';

const props = defineProps<{
  id: string;
  post: Sale;
}>();

const badRequestErrorModal = useTemplateRef('badRequest');
const imagesInput = useTemplateRef('imagesInput');

const { updateSale } = useUser();
const { refresh } = useAuth();
const { openSubmitLoading, closeSubmitLoading } = useGlobal();
const { parsePhone } = useUser();
const toast = useToast();

const { phone: initPhone, code: initCode } = parsePhone(props.post.contact.phone);

const state = reactive<UpdateSaleInput>({
  amount: props.post.details.amount.toString(),
  currency: props.post.details.currency,
  phone: {
    phone: initPhone,
    code: initCode,
  },
  whatsapp: props.post.contact.whatsapp,
  properties: [
    {
      address: {
        province: props.post.properties[0].address.province,
        municipality: props.post.properties[0].address.municipality,
      },
      features: {
        bed: props.post.properties[0].features.bed.toString(),
        bath: props.post.properties[0].features.bath.toString(),
        backyard: props.post.properties[0].features.backyard,
        balcony: props.post.properties[0].features.balcony,
        garage: props.post.properties[0].features.garage,
        pool: props.post.properties[0].features.pool,
      },
    },
  ],
  images: [],
  description: props.post.description,
});

const map = ref<Map>({
  new: [],
  removed: [],
});

const errorVisibility = ref(true);

const { handleSubmit, setFieldError, isSubmitting } = useForm<UpdateSaleSchema>({
  validationSchema: toTypedSchema(updateSaleSchema),
});

function onReset() {
  const { phone, code } = parsePhone(props.post.contact.phone);
  state.amount = props.post.details.amount.toString();
  state.currency = props.post.details.currency;
  state.phone.phone = phone;
  state.phone.code = code;
  state.whatsapp = props.post.contact.whatsapp;
  state.description = props.post.description;
  state.properties[0].address.province = props.post.properties[0].address.province;
  state.properties[0].address.municipality = props.post.properties[0].address.municipality;
  state.properties[0].features.bed = props.post.properties[0].features.bed.toString();
  state.properties[0].features.bath = props.post.properties[0].features.bath.toString();
  state.properties[0].features.backyard = props.post.properties[0].features.backyard;
  state.properties[0].features.balcony = props.post.properties[0].features.balcony;
  state.properties[0].features.garage = props.post.properties[0].features.garage;
  state.properties[0].features.pool = props.post.properties[0].features.pool;
  state.images = [];
  map.value = {
    new: [],
    removed: [],
  };

  if (imagesInput.value) imagesInput.value.reset();
  else showError(createError({ status: 500 }));
}

const onSubmit = handleSubmit(async (values) => {
  try {
    openSubmitLoading();

    const data = await updateSale(values, props.id, map.value);
    await navigateTo({ name: 'posts-id', params: { id: data.postId } });

    toast.add({
      timeout: 4000,
      title: 'Anuncio Actualizado',
    });
  } catch (error) {
    if (error instanceof AccessTokenExpiredError) {
      await refresh().catch(() => showError(createError({ status: 500 })));
      onSubmit();
    } else if (error instanceof BadRequestError) {
      badRequestErrorModal.value?.openModal();
    } else if (error instanceof MaxImageSizeError) {
      setFieldError('images', 'La imagen es muy grande');
      imagesInput.value?.setBackendError(error.index);
    } else {
      showError(createError({ status: 500 }));
    }
  } finally {
    closeSubmitLoading();
  }
});
</script>

<template>
  <UForm :state="state" @submit="onSubmit">
    <div class="auto-cols-auto grid-cols-2 grid-rows-1 lg:grid lg:gap-x-12 xl:gap-x-20">
      <!-- Left Column -->
      <div class="col-start-1 row-start-1 self-center">
        <div class="top-0 mb-4 flex-col gap-5 lg:flex">
          <!-- Hero -->
          <section class="flex flex-col gap-2 lg:mb-0">
            <h2
              class="font-ubuntu font-bold"
              :class="[useStyles().textColorPrimary, useStyles().textSize4XL]"
            >
              Editar anuncio
            </h2>
            <p>
              Actualiza los datos de tu anuncio para asegurarte de que destaque y atraiga a los
              usuarios adecuados.
            </p>
          </section>
        </div>
      </div>

      <!-- Right Column -->
      <div class="col-start-2 row-start-1 self-center">
        <div class="flex">
          <!-- Amount -->
          <div class="mb-4 w-[45%] max-w-64 min-[340px]:w-[43%] min-[345px]:w-[41%]">
            <InputPostAmount
              v-model="state.amount"
              :error-visibility="errorVisibility"
              name="amount"
              label-attrib="Precio"
            />
          </div>

          <!-- Currency -->
          <div
            class="relative top-7 flex h-min flex-grow items-center justify-center gap-x-2 min-[345px]:gap-x-3 min-[365px]:gap-x-4 min-[385px]:gap-x-5"
          >
            <InputPostCurrency v-model="state.currency" name="currency" />
          </div>
        </div>

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

    <!-- Property -->
    <div>
      <div
        class="mb-4 flex flex-col gap-x-3 rounded-xl border border-gray-300 px-3 pb-3 pt-4 lg:flex-row lg:px-5 lg:pt-[18px] dark:border-gray-700"
      >
        <!-- Address -->
        <InputPostAddress
          v-model:province="state.properties[0].address.province"
          v-model:municipality="state.properties[0].address.municipality"
          :index="0"
          province-name="properties[0].address.province"
          municipality-name="properties[0].address.municipality"
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
                v-model="state.properties[0].features.bed"
                :error-visibility="errorVisibility"
                name="properties[0].features.bed"
                label-attrib="Cuartos"
              />
            </div>

            <!-- Bath -->
            <div class="mb-2.5 w-full">
              <InputPostFeature
                v-model="state.properties[0].features.bath"
                :error-visibility="errorVisibility"
                name="properties[0].features.bath"
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
                v-model="state.properties[0].features.backyard"
                label="Patio"
                name="properties[0].features.backtard"
                name-attrib="backyard-1"
              />
            </div>

            <!-- Balcony -->
            <div class="mb-2 lg:min-w-[125px]">
              <InputCheckbox
                v-model="state.properties[0].features.balcony"
                label="Balcón"
                name="properties[0].features.balcony"
                name-attrib="balcony-1"
              />
            </div>

            <!-- Garage -->
            <div class="mb-2 lg:min-w-[125px]">
              <InputCheckbox
                v-model="state.properties[0].features.garage"
                label="Garage"
                name="properties[0].features.garage"
                name-attrib="garage-1"
              />
            </div>

            <!-- Pool -->
            <div class="mb-2 lg:min-w-[125px]">
              <InputCheckbox
                v-model="state.properties[0].features.pool"
                label="Piscina"
                name="properties[0].features.pool"
                name-attrib="pool-1"
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
        <InputPostUpdateImage
          ref="imagesInput"
          v-model:images="state.images"
          v-model:map="map"
          name="images"
          :error-visibility="errorVisibility"
          :previous-images="props.post.images"
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

        <!-- CTA's -->
        <div class="grid w-full grid-cols-2 gap-x-4">
          <!-- Reset -->
          <UButton
            type="button"
            size="md"
            block
            :ui="useUIConfigs().cancelButtonConfig"
            class="font-bold"
            @click="onReset"
            >Restablecer</UButton
          >

          <!-- Submit -->
          <UButton
            type="submit"
            size="md"
            block
            :disabled="isSubmitting"
            :ui="useUIConfigs().acceptButtonConfig"
            class="font-bold"
            >Guardar</UButton
          >
        </div>
      </div>
    </div>

    <!-- Bad Request Error -->
    <ModalMinimalError
      ref="badRequest"
      title="Error de solicitud"
      body="Estamos afrontando dificultades para procesar tu solicitud. Por favor, refresca esta página e inténtalo más tarde."
    />
  </UForm>
</template>
