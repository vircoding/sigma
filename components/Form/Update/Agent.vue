<script setup lang="ts">
import {
  AccessTokenExpiredError,
  FormFieldError,
  MaxSizeError,
  BadRequestError,
} from '~/models/classes/client/Error';
import { updateAgentSchema } from '~/models/schemas/client/UpdateAgentSchema';
import type { UpdateAgentSchema } from '~/models/schemas/client/UpdateAgentSchema';
import type { UpdateAgentInput } from '~/models/types/User';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

if (!user.value || user.value?.type === 'client') throw showError(createError({ status: 500 }));

const { parsePhone, updateAgent } = useUser();
const { refresh } = useAuth();
const { openSubmitLoading, closeSubmitLoading } = useGlobal();
const toast = useToast();

const badRequestErrorModal = useTemplateRef('badRequest');
const avatarInput = useTemplateRef('avatarInput');

const errorVisibility = ref(true);
const previousAvatar = ref<string>(user.value.avatar);

const { phone: initPhone, code: initCode } = parsePhone(user.value.phone);
const state = reactive<UpdateAgentInput>({
  firstname: user.value.firstname,
  lastname: user.value.lastname,
  bio: user.value.bio,
  phone: {
    code: initCode,
    phone: initPhone,
  },
});

const { handleSubmit, setFieldError, isSubmitting } = useForm<UpdateAgentSchema>({
  validationSchema: toTypedSchema(updateAgentSchema),
});

function onReset() {
  if (!user.value || user.value?.type === 'client') throw showError(createError({ status: 500 }));

  previousAvatar.value = user.value.avatar;

  const { phone, code } = parsePhone(user.value.phone);
  state.firstname = user.value.firstname;
  state.lastname = user.value.lastname;
  state.bio = user.value.bio;
  state.phone.code = code;
  state.phone.phone = phone;
  state.avatar = undefined;

  if (avatarInput.value) avatarInput.value.reset();
  else showError(createError({ status: 500 }));
}

const onSubmit = handleSubmit(async (values) => {
  try {
    openSubmitLoading();

    await updateAgent(values);
    onReset();
    toast.add({
      timeout: 4000,
      title: 'Datos Actualizados',
    });
  } catch (error) {
    if (error instanceof AccessTokenExpiredError) {
      await refresh().catch(() => showError(createError({ status: 500 })));
      onSubmit();
    } else if (error instanceof MaxSizeError) {
      setFieldError('avatar', 'La imagen es muy grande');
    } else if (error instanceof BadRequestError || error instanceof FormFieldError) {
      badRequestErrorModal.value?.openModal();
    } else showError(createError({ status: 500 }));
  } finally {
    closeSubmitLoading();
  }
});

defineExpose<{
  syncData: () => void;
}>({
  syncData: function () {
    onReset();
  },
});
</script>

<template>
  <UForm :state="state" class="grid-cols-2 lg:grid lg:gap-x-12 xl:gap-x-20" @submit="onSubmit">
    <!-- Left Column -->
    <div class="flex-col gap-5 lg:flex lg:self-end">
      <!-- Hero -->
      <section class="mb-7 flex flex-col gap-2 lg:mb-0">
        <h2
          class="font-ubuntu font-bold"
          :class="[useStyles().textColorPrimary, useStyles().textSize4XL]"
        >
          Edita tu cuenta
        </h2>
        <p>Actualiza los datos de tu perfil y acércate aún más a tus clientes potenciales.</p>
      </section>

      <div>
        <div class="flex gap-2">
          <!-- Avatar -->
          <InputUserAvatar
            ref="avatarInput"
            v-model="state.avatar"
            name="avatar"
            :previous-avatar="previousAvatar"
            :error-visibility="errorVisibility"
            class="mb-4"
          />

          <div class="flex grow flex-col">
            <!-- Firstname -->
            <InputUserName
              v-model="state.firstname"
              name="firstname"
              label-attrib="Nombre"
              :error-visibility="errorVisibility"
              class="mb-4"
            />

            <!-- Lastname -->
            <InputUserName
              v-model="state.lastname"
              name="lastname"
              label-attrib="Apellidos"
              :error-visibility="errorVisibility"
              class="mb-4"
            />
          </div>
        </div>

        <!-- Whatsapp -->
        <InputPhone
          v-model:code="state.phone.code"
          v-model:phone="state.phone.phone"
          :error-visibility="errorVisibility"
          label-attrib="Whatsapp"
          code-name="phone.code"
          phone-name="phone.phone"
          class="mb-4 lg:mb-0"
        />
      </div>
    </div>

    <!-- Right Column -->
    <div class="col-start-2 row-start-1 self-center">
      <!-- Bio -->
      <InputUserBio
        v-model="state.bio"
        :error-visibility="errorVisibility"
        name="bio"
        class="mb-6"
      />

      <!-- CTA's -->
      <div class="grid grid-cols-2 gap-x-4">
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

    <!-- Bad Request Error -->
    <ModalMinimalError
      ref="badRequest"
      title="Error de solicitud"
      body="Estamos afrontando dificultades para procesar tu solicitud. Por favor, refresca esta página e inténtalo más tarde."
    />
  </UForm>
</template>
