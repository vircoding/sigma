<script setup lang="ts">
import { ZodError } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { registerClientSchema, type RegisterClientSchema } from '~/schemas/register';
import { BadRequestError, ConflictError, FormFieldError } from '~/models/Error';
import { ModalLoadingAnimation, ModalMinimalError } from '#components';

const { registerClient } = useAuth();
const modals = useModal();

const conflictErrorModal = ref<InstanceType<typeof ModalMinimalError>>();
const badRequestErrorModal = ref<InstanceType<typeof ModalMinimalError>>();

type ErrorItem = {
  error: boolean;
  message?: string;
};

const backendErrors = ref<{
  email: boolean;
  password: boolean;
  repassword: boolean;
}>({
  email: false,
  password: false,
  repassword: false,
});

const errors = computed<{
  email: ErrorItem;
  password: ErrorItem;
  repassword: ErrorItem;
}>(() => {
  try {
    registerClientSchema.parse(state);
    return {
      email: { error: false },
      password: { error: false },
      repassword: { error: false },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const fields = error.errors.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      const emailErrors = fields.filter((value) => value.field === 'email');
      const passwordErrors = fields.filter((value) => value.field === 'password');
      const repasswordErrors = fields.filter((value) => value.field === 'repassword');

      return {
        email: { error: emailErrors.length !== 0, message: emailErrors[0]?.message },
        password: { error: passwordErrors.length !== 0, message: passwordErrors[0]?.message },
        repassword: { error: repasswordErrors.length !== 0, message: repasswordErrors[0]?.message },
      };
    }

    return {
      email: { error: true },
      password: { error: true },
      repassword: { error: true },
    };
  }
});

const errorVisibility = ref({
  email: false,
  password: false,
  repassword: false,
});

const state = reactive({
  email: '',
  password: '',
  repassword: '',
});

function $reset() {
  state.email = '';
  state.password = '';
  state.repassword = '';

  resetBackendError('email');
  resetBackendError('password');
  resetBackendError('repassword');

  errorVisibility.value.email = false;
  errorVisibility.value.password = false;
  errorVisibility.value.repassword = false;
}

const passwordVisibility = ref(false);

function turnAllErrorsVisible() {
  errorVisibility.value.email = true;
  errorVisibility.value.password = true;
  errorVisibility.value.repassword = true;
}

function resetBackendError(field: 'email' | 'password' | 'repassword') {
  backendErrors.value[field] = false;
}

function setBackendError(field: 'email' | 'password' | 'repassword') {
  backendErrors.value[field] = true;
}

async function onSubmit(event: FormSubmitEvent<RegisterClientSchema>) {
  turnAllErrorsVisible();

  if (!Object.values(errors.value).some((field) => field.error)) {
    modals.open(ModalLoadingAnimation);

    try {
      await registerClient(event.data);
      $reset();
    } catch (error) {
      if (error instanceof ConflictError) {
        conflictErrorModal.value?.openModal();
      } else if (error instanceof BadRequestError) {
        badRequestErrorModal.value?.openModal();
      } else if (error instanceof FormFieldError) {
        const fields = error.fields.map((value) => value.field);
        let anyField = false;
        fields.forEach((field) => {
          if (['email', 'password', 'repassword'].includes(field)) {
            anyField = true;
            setBackendError(field as 'email' | 'password' | 'repassword');
          }
        });
        if (!anyField) badRequestErrorModal.value?.openModal();
      } else showError(new Error('Fatal Error'));
    } finally {
      await modals.close();
    }
  }
}
</script>

<template>
  <UContainer
    class="grid-cols-2 lg:grid lg:gap-x-12 xl:gap-x-20"
    :class="[useStyles().pageContainer]"
  >
    <div class="flex-col gap-10 lg:flex lg:self-center">
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
      <section class="hidden flex-col gap-1 lg:flex">
        <span
          class="w-min text-nowrap font-medium"
          :class="[useStyles().textColorPrimary, useStyles().textSizeLG]"
          >¿Ya tienes cuenta?</span
        >
        <NuxtLink
          :to="{ name: 'auth-register-agent' }"
          class="w-min text-nowrap font-medium"
          :class="[useStyles().textColorPrimary, useStyles().textSizeLG]"
          >¿Eres agente?</NuxtLink
        >
      </section>
    </div>

    <!-- Form -->
    <UForm :state="state" @submit="onSubmit">
      <!-- Email -->
      <UFormGroup
        size="md"
        label="Correo Electrónico"
        name="email"
        :error="
          (backendErrors.email && 'Debe ser un correo electrónico válido') ||
          (errors.email.error && errorVisibility.email && errors.email.message)
        "
        class="mb-4"
      >
        <template #label="{ label, error }">
          <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
        </template>

        <template #default="{ error }">
          <UInput
            v-model.trim="state.email"
            size="md"
            type="email"
            :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
            @blur="errorVisibility.email = true"
            @input="resetBackendError('email')"
          />
        </template>

        <template #error="{ error }">
          <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
            {{ error }}
          </span>
        </template>
      </UFormGroup>

      <!-- Password -->
      <UFormGroup
        size="md"
        label="Contraseña"
        name="password"
        :error="
          (backendErrors.password && 'Debe ser una contraseña válida') ||
          (errors.password.error && errorVisibility.password && errors.password.message)
        "
        class="mb-4"
      >
        <template #label="{ label, error }">
          <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
        </template>

        <template #default="{ error }">
          <UInput
            v-model.trim="state.password"
            size="md"
            :type="passwordVisibility ? 'text' : 'password'"
            @blur="errorVisibility.password = true"
          >
            <template #trailing>
              <UIcon
                v-if="error"
                name="i-heroicons-exclamation-circle"
                class="mr-2 h-5 w-5 md:h-6 md:w-6"
                :class="[useStyles().textColorError]"
              />
              <UIcon
                name="i-solar-eye-broken"
                class="z-50 h-5 w-5 cursor-pointer md:h-6 md:w-6"
                :class="[
                  error ? useStyles().textColorError : useStyles().textColorPrimary,
                  passwordVisibility ? 'hidden' : undefined,
                ]"
                @click="passwordVisibility = true"
              />
              <UIcon
                name="i-solar-eye-closed-broken"
                class="relative top-0.5 z-50 h-5 w-5 cursor-pointer md:h-6 md:w-6"
                :class="[
                  error ? useStyles().textColorError : useStyles().textColorPrimary,
                  !passwordVisibility ? 'hidden' : undefined,
                ]"
                @click="passwordVisibility = false"
              />
            </template>
          </UInput>
        </template>

        <template #error="{ error }">
          <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
            {{ error }}
          </span>
        </template>
      </UFormGroup>

      <!-- Repassword -->
      <UFormGroup
        size="md"
        label="Confirmar Contraseña"
        name="repassword"
        :error="
          (backendErrors.repassword && 'Debe ser una contraseña válida') ||
          (errors.repassword.error && errorVisibility.repassword && errors.repassword.message)
        "
        class="mb-6"
      >
        <template #label="{ label, error }">
          <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
        </template>

        <template #default="{ error }">
          <UInput
            v-model.trim="state.repassword"
            size="md"
            :type="passwordVisibility ? 'text' : 'password'"
            :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
            @blur="errorVisibility.repassword = true"
          />
        </template>

        <template #error="{ error }">
          <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
            {{ error }}
          </span>
        </template>
      </UFormGroup>

      <!-- Submit -->
      <UButton
        type="submit"
        size="md"
        block
        :ui="useUIConfigs().acceptButtonConfig"
        class="mb-6 font-bold"
        >Registrarse</UButton
      >

      <!-- Cookies and privacy -->
      <div class="mb-6 px-4 text-center lg:mb-0" :class="[useStyles().textSizeXS]">
        <p :class="[useStyles().textColorSecondary]">
          Al registrarte en nuestro sitio, aceptas nuestras
          <span class="font-bold" :class="[useStyles().textColorPrimary]"
            >políticas de cookies</span
          >
          y <span class="font-bold" :class="[useStyles().textColorPrimary]">privacidad</span>.
        </p>
      </div>

      <!-- Mobile CTA's -->
      <section class="flex flex-col items-center lg:hidden">
        <span
          class="w-min text-nowrap font-medium"
          :class="[useStyles().textColorPrimary, useStyles().textSizeLG]"
          >¿Ya tienes cuenta?</span
        >
        <NuxtLink
          :to="{ name: 'auth-register-agent' }"
          class="w-min text-nowrap font-medium"
          :class="[useStyles().textColorPrimary, useStyles().textSizeLG]"
          >¿Eres agente?</NuxtLink
        >
      </section>
    </UForm>

    <!-- Conflict Error -->
    <ModalMinimalError
      ref="conflictErrorModal"
      title="Usuario existente"
      body="Ya existe un usuario registrado y verificado con este correo electrónico. Pruebe con uno diferente."
    />

    <!-- Bad Request Error -->
    <ModalMinimalError
      ref="badRequestErrorModal"
      title="Error de solicitud"
      body="Estamos afrontando dificultades para procesar tu solicitud. Por favor, refresca esta página e inténtalo más tarde."
    />
  </UContainer>
</template>
