<script setup lang="ts">
import { BadRequestError, ConflictError, FormFieldError } from '~/models/classes/client/Error';
import {
  registerClientSchema,
  type RegisterClientSchema,
} from '~/models/schemas/client/RegisterSchema';
import type { LoginInput, RegisterClientInput } from '~/models/types/User';

const emit = defineEmits<{
  (e: 'verify', login: LoginInput): void;
}>();

const { registerClient } = useAuth();
const { openSubmitLoading, closeSubmitLoading } = useGlobal();

const conflictErrorModal = useTemplateRef('conflict');
const badRequestErrorModal = useTemplateRef('badRequest');

const errorVisibility = ref(false);
const passwordVisibility = ref(false);

const state = reactive<RegisterClientInput>({
  email: '',
  password: '',
  repassword: '',
});

const { handleSubmit, isSubmitting } = useForm<RegisterClientSchema>({
  validationSchema: toTypedSchema(registerClientSchema),
});

const onSubmit = handleSubmit(
  async (values) => {
    try {
      openSubmitLoading();

      await registerClient(values);
      emit('verify', { email: values.email, password: values.password });
    } catch (error) {
      if (error instanceof ConflictError) {
        conflictErrorModal.value?.openModal();
      } else if (error instanceof BadRequestError || error instanceof FormFieldError) {
        badRequestErrorModal.value?.openModal();
      } else showError(createError({ status: 500 }));
    } finally {
      closeSubmitLoading();
    }
  },
  () => {
    errorVisibility.value = true;
  },
);
</script>

<template>
  <UForm :state="state" class="grid-cols-2 lg:grid lg:gap-x-12 xl:gap-x-20" @submit="onSubmit">
    <!-- Left Column -->
    <div class="flex-col gap-5 lg:flex lg:self-center">
      <!-- Hero -->
      <section class="mb-7 flex flex-col gap-2 lg:mb-0">
        <h2
          class="font-ubuntu font-bold"
          :class="[useStyles().textColorPrimary, useStyles().textSize4XL]"
        >
          Regístrate como Propietario
        </h2>
        <p>Crea tu cuenta como Propietario si deseas vender o rentar tu casa.</p>
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
          :to="{ name: 'auth-register-agent' }"
          class="w-min text-nowrap font-medium"
          :class="[useStyles().linkActiveState]"
          >¿Eres agente?</NuxtLink
        >
      </section>
    </div>

    <!-- Right Column -->
    <div class="col-start-2 row-start-1 self-center">
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
        class="mb-6"
      />

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
          :to="{ name: 'auth-register-agent' }"
          class="w-min text-nowrap font-medium"
          :class="[useStyles().linkActiveState]"
          >¿Eres agente?</NuxtLink
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
