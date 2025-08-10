<script setup lang="ts">
import { AccessTokenExpiredError, BadRequestError, MaxImageSizeError } from '~/classes/Error';
import { getUpdateExchangeSchema } from '~/schemas/UpdatePostSchema';
import type { UpdateExchangeSchema } from '~/schemas/UpdatePostSchema';

const props = defineProps<{
  id: string;
  post: Exchange;
}>();

const badRequestErrorModal = useTemplateRef('badRequest');
const imagesInput = useTemplateRef('imagesInput');

const { updateExchange } = useUser();
const { refresh } = useAuth();
const { setSubmitLoading } = useUIConfig();
const toast = useToast();

const { phone: initPhone, code: initCode } = parsePhone(props.post.contact.phone);

if (![1, 2, 3].includes(props.post.details.offers)) throw showError(createError({ status: 500 }));
if (![0, 1, 2, 3].includes(props.post.details.needs)) throw showError(createError({ status: 500 }));
if (props.post.details.offers !== props.post.properties.length)
  throw showError(createError({ status: 500 }));

const state = reactive<UpdateExchangeInput>({
  offers: props.post.details.offers as Offers,
  needs: props.post.details.needs as Needs,
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
    {
      address: {
        province: props.post.properties[1]
          ? props.post.properties[1].address.province
          : PROVINCES['La Habana'],
        municipality: props.post.properties[1]
          ? props.post.properties[1].address.municipality
          : 'La Habana Vieja',
      },
      features: {
        bed: props.post.properties[1] ? props.post.properties[1].features.bed.toString() : '0',
        bath: props.post.properties[1] ? props.post.properties[1].features.bath.toString() : '0',
        backyard: props.post.properties[1] ? props.post.properties[1].features.backyard : false,
        balcony: props.post.properties[1] ? props.post.properties[1].features.balcony : false,
        garage: props.post.properties[1] ? props.post.properties[1].features.garage : false,
        pool: props.post.properties[1] ? props.post.properties[1].features.pool : false,
      },
    },
    {
      address: {
        province: props.post.properties[2]
          ? props.post.properties[2].address.province
          : PROVINCES['La Habana'],
        municipality: props.post.properties[2]
          ? props.post.properties[2].address.municipality
          : 'La Habana Vieja',
      },
      features: {
        bed: props.post.properties[2] ? props.post.properties[2].features.bed.toString() : '0',
        bath: props.post.properties[2] ? props.post.properties[2].features.bath.toString() : '0',
        backyard: props.post.properties[2] ? props.post.properties[2].features.backyard : false,
        balcony: props.post.properties[2] ? props.post.properties[2].features.balcony : false,
        garage: props.post.properties[2] ? props.post.properties[2].features.garage : false,
        pool: props.post.properties[2] ? props.post.properties[2].features.pool : false,
      },
    },
  ],
  images: [],
  description: props.post.description,
});

const map = ref<UpdateImageMap>({
  new: [],
  removed: [],
});

const errorVisibility = ref(true);

const { handleSubmit, setFieldError, isSubmitting } = useForm<UpdateExchangeSchema>({
  validationSchema: computed(() => {
    return toTypedSchema(getUpdateExchangeSchema(state.offers));
  }),
});

function onReset() {
  if (![1, 2, 3].includes(props.post.details.offers)) throw showError(createError({ status: 500 }));
  if (![0, 1, 2, 3].includes(props.post.details.needs))
    throw showError(createError({ status: 500 }));
  if (props.post.details.offers !== props.post.properties.length)
    throw showError(createError({ status: 500 }));

  const { phone, code } = parsePhone(props.post.contact.phone);

  state.offers = props.post.details.offers as Offers;
  state.needs = props.post.details.needs as Needs;
  state.phone.phone = phone;
  state.phone.code = code;
  state.whatsapp = props.post.contact.whatsapp;
  state.description = props.post.description;
  state.properties.forEach((property, index) => {
    return {
      address: {
        province: props.post.properties[index]
          ? props.post.properties[index].address.province
          : PROVINCES['La Habana'],
        municipality: props.post.properties[index]
          ? props.post.properties[index].address.municipality
          : 'La Habana Vieja',
      },
      features: {
        bed: props.post.properties[index]
          ? props.post.properties[index].features.bed.toString()
          : '0',
        bath: props.post.properties[index]
          ? props.post.properties[index].features.bath.toString()
          : '0',
        backyard: props.post.properties[index]
          ? props.post.properties[index].features.backyard
          : false,
        balcony: props.post.properties[index]
          ? props.post.properties[index].features.balcony
          : false,
        garage: props.post.properties[index] ? props.post.properties[index].features.garage : false,
        pool: props.post.properties[index] ? props.post.properties[index].features.pool : false,
      },
    };
  });

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
    setSubmitLoading();

    const data = await updateExchange(values, props.id, map.value);
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
    setSubmitLoading(false);
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
        <div class="flex flex-col items-center gap-x-3 min-[395px]:flex-row">
          <!-- Offers -->
          <div class="mb-4 w-full">
            <InputPostOffers v-model="state.offers" name="offers" />
          </div>

          <!-- Needs -->
          <div class="mb-4 w-full">
            <InputPostNeeds v-model="state.needs" name="needs" />
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

    <!-- Properties -->
    <div v-for="(property, index) in state.properties" :key="`property-${index + 1}`">
      <div
        v-if="index <= state.offers - 1 || index === 0"
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
            :ui="useUIConfig().cancelButtonConfig"
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
            :ui="useUIConfig().acceptButtonConfig"
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
