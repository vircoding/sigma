<script setup lang="ts">
import {
  BadRequestError,
  ConflictError,
  FormFieldError,
  MaxSizeError,
} from '~/models/classes/client/Error';
import {
  registerAgentSchema,
  type RegisterAgentSchema,
} from '~/models/schemas/client/RegisterSchema';
import type { LoginInput, RegisterAgentInput } from '~/models/types/User';

const emit = defineEmits<{
  (e: 'verify', login: LoginInput): void;
}>();

const { registerAgent } = useAuth();
const { openSubmitLoading, closeSubmitLoading } = useGlobal();

const conflictErrorModal = useTemplateRef('conflict');
const badRequestErrorModal = useTemplateRef('badRequest');

const errorVisibility = ref(false);
const passwordVisibility = ref(false);

const state = reactive<RegisterAgentInput>({
  email: '',
  password: '',
  repassword: '',
  firstname: '',
  lastname: '',
  bio: '',
  phone: {
    phone: '',
    code: '53',
  },
});

const { handleSubmit, setFieldError, isSubmitting } = useForm<RegisterAgentSchema>({
  validationSchema: toTypedSchema(registerAgentSchema),
});

const onSubmit = handleSubmit(
  async (values) => {
    try {
      openSubmitLoading();

      await registerAgent(values);
      emit('verify', { email: values.email, password: values.password });
    } catch (error) {
      if (error instanceof MaxSizeError) {
        setFieldError('avatar', 'La imagen es muy grande');
      } else if (error instanceof ConflictError) {
        conflictErrorModal.value?.openModal();
      } else if (error instanceof BadRequestError || error instanceof FormFieldError) {
        badRequestErrorModal.value?.openModal();
      } else showError(createError({ status: 500 }));
    } finally {
      closeSubmitLoading();
    }
  },
  ({ errors }) => {
    console.log(errors);
    errorVisibility.value = true;
  },
);
</script>

<template>
  <UForm
    :state="state"
    class="auto-cols-auto grid-cols-2 grid-rows-2 lg:grid lg:gap-x-12 xl:gap-x-20"
    @submit="onSubmit"
  >
    <!-- Top Left Column -->
    <div class="col-start-1 row-start-1 flex-col justify-end gap-5 lg:flex">
      <!-- Hero -->
      <section class="mb-7 flex flex-col gap-2 lg:mb-0">
        <h2
          class="font-ubuntu font-bold"
          :class="[useStyles().textColorPrimary, useStyles().textSize4XL]"
        >
          Regístrate como Agente
        </h2>
        <p>Crea tu cuenta como Agente si deseas vender o rentar más de una casa.</p>
      </section>

      <!-- Desktop CTA's -->
      <section class="hidden flex-col lg:flex">
        <NuxtLink
          :to="{ name: 'auth-login' }"
          class="w-min text-nowrap font-medium"
          :class="[useStyles().linkActiveState]"
          >¿Ya tienes cuenta?</NuxtLink
        >

        <NuxtLink
          :to="{ name: 'auth-register-client' }"
          class="w-min text-nowrap font-medium"
          :class="[useStyles().linkActiveState]"
          >¿No eres agente?</NuxtLink
        >
      </section>
    </div>

    <!-- Bottom Left Column -->
    <div class="col-start-1 row-start-2 self-end">
      <!-- Email -->
      <InputUserEmail
        v-model="state.email"
        :error-visibility="errorVisibility"
        name="email"
        class="mb-4"
      />

      <!-- Password -->
      <InputUserPassword
        v-model:password="state.password"
        v-model:password-visibility="passwordVisibility"
        :error-visibility="errorVisibility"
        name="password"
        class="mb-4"
      />

      <!-- Repassword -->
      <InputUserRepassword
        v-model="state.repassword"
        :error-visibility="errorVisibility"
        :password-visibility="passwordVisibility"
        name="repassword"
        class="mb-4 lg:mb-0"
      />
    </div>

    <!-- Right Column -->
    <div class="col-start-2 row-span-2 row-start-1">
      <div class="col-start-2 row-span-2 row-start-1">
        <div class="flex gap-2">
          <!-- Avatar -->
          <InputUserAvatar
            v-model="state.avatar"
            name="avatar"
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
          class="mb-4"
        />

        <InputUserBio
          v-model="state.bio"
          :error-visibility="errorVisibility"
          name="bio"
          class="mb-6 lg:mb-0"
        />
      </div>
    </div>

    <!-- Bottom Right Column -->
    <div class="col-start-2 row-start-3 lg:mt-6">
      <!-- Submit -->
      <UButton
        type="submit"
        size="md"
        block
        :disabled="isSubmitting"
        :ui="useUIConfigs().acceptButtonConfig"
        class="mb-6 font-bold"
        >Registrarse</UButton
      >

      <!-- Cookies and privacy -->
      <div class="mb-6 px-4 text-center lg:mb-0" :class="[useStyles().textSizeXS]">
        <p :class="[useStyles().textColorSecondary]">
          Al registrarte en nuestro sitio, aceptas nuestras
          <NuxtLink :to="{ name: 'support-cookies' }">
            <span class="font-bold underline" :class="[useStyles().textColorPrimary]"
              >políticas de cookies</span
            >
          </NuxtLink>
          y
          <NuxtLink :to="{ name: 'support-privacy' }">
            <span class="font-bold underline" :class="[useStyles().textColorPrimary]"
              >privacidad</span
            > </NuxtLink
          >.
        </p>
      </div>

      <!-- Mobile CTA's -->
      <section class="flex flex-col items-center lg:hidden">
        <NuxtLink
          :to="{ name: 'auth-login' }"
          class="w-min text-nowrap font-medium"
          :class="[useStyles().linkActiveState]"
          >¿Ya tienes cuenta?</NuxtLink
        >

        <NuxtLink
          :to="{ name: 'auth-register-client' }"
          class="w-min text-nowrap font-medium"
          :class="[useStyles().linkActiveState]"
          >¿No eres agente?</NuxtLink
        >
      </section>
    </div>

    <!-- Conflict Error -->
    <ModalMinimalError
      ref="conflict"
      title="Usuario existente"
      body="Ya existe un usuario registrado y verificado con este correo electrónico. Pruebe con uno diferente."
    />

    <!-- Bad Request Error -->
    <ModalMinimalError
      ref="badRequest"
      title="Error de solicitud"
      body="Estamos afrontando dificultades para procesar tu solicitud. Por favor, refresca esta página e inténtalo más tarde."
    />
  </UForm>
</template>
