<script setup lang="ts">
import { ZodError } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { loginSchema, type LoginSchema } from '~/models/ValSchema';
import { ModalLoadingAnimation, ModalMinimalError } from '#components';
import { BadCredentialsError, FormFieldError, BadRequestError } from '~/models/Error';

definePageMeta({
  middleware: 'no-auth',
});

type ErrorItem = {
  error: boolean;
  message?: string;
};

type BackendErrorField = 'email' | 'password';

const { login } = useAuth();

const modals = useModal();

const badCredentialsErrorModal = ref<InstanceType<typeof ModalMinimalError>>();
const badRequestErrorModal = ref<InstanceType<typeof ModalMinimalError>>();

const state = reactive({
  email: '',
  password: '',
});

const backendErrors = ref<{
  email: boolean;
  password: boolean;
}>({
  email: false,
  password: false,
});

const errors = computed<{
  email: ErrorItem;
  password: ErrorItem;
}>(() => {
  try {
    loginSchema.parse(state);
    return {
      email: { error: false },
      password: { error: false },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const fields = error.errors.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      const emailErrors = fields.filter((value) => value.field === 'email');
      const passwordErrors = fields.filter((value) => value.field === 'password');

      return {
        email: { error: emailErrors.length !== 0, message: emailErrors[0]?.message },
        password: { error: passwordErrors.length !== 0, message: passwordErrors[0]?.message },
      };
    }

    return {
      email: { error: true },
      password: { error: true },
    };
  }
});

const errorVisibility = ref({
  email: false,
  password: false,
});

function $reset() {
  state.email = '';
  state.password = '';

  resetBackendError('email');
  resetBackendError('password');

  errorVisibility.value.email = false;
  errorVisibility.value.password = false;

  passwordVisibility.value = false;
}

const passwordVisibility = ref(false);

function turnAllErrorsVisible() {
  errorVisibility.value.email = true;
  errorVisibility.value.password = true;
}

function resetBackendError(field: BackendErrorField) {
  backendErrors.value[field] = false;
}

function setBackendError(field: BackendErrorField) {
  backendErrors.value[field] = true;
}

async function onSubmit(event: FormSubmitEvent<LoginSchema>) {
  turnAllErrorsVisible();

  if (!Object.values(errors.value).some((field) => field.error)) {
    modals.open(ModalLoadingAnimation);

    try {
      await login(event.data);
      await navigateTo({ name: 'index' });
    } catch (error) {
      if (error instanceof BadCredentialsError) {
        badCredentialsErrorModal.value?.openModal();
      } else if (error instanceof BadRequestError) {
        badRequestErrorModal.value?.openModal();
      } else if (error instanceof FormFieldError) {
        const fields = error.fields.map((value) => value.field);
        let anyField = false;
        fields.forEach((field) => {
          if (['email', 'password', 'repassword'].includes(field)) {
            anyField = true;
            setBackendError(field as 'email' | 'password');
          }
        });
        if (!anyField) badRequestErrorModal.value?.openModal();
      } else showError(createError({ status: 500 }));
    } finally {
      await modals.close();
    }
  }
}

onUnmounted(() => {
  $reset();
});
</script>

<template>
  <UContainer
    class="w-full grid-cols-2 lg:grid lg:gap-x-12 xl:gap-x-20"
    :class="[useStyles().pageContainer]"
  >
    <div class="flex-col gap-5 lg:flex lg:self-center">
      <!-- Hero -->
      <section class="mb-7 flex flex-col gap-2 lg:mb-0">
        <h2
          class="font-ubuntu font-bold"
          :class="[useStyles().textColorPrimary, useStyles().textSize4XL]"
        >
          Iniciar sesión
        </h2>
        <p>Ingresa los datos y accede a Sigma con tu cuenta.</p>
      </section>

      <!-- Desktop CTA's -->
      <section class="hidden flex-col lg:flex">
        <NuxtLink
          :to="{ name: 'auth-register' }"
          class="w-min text-nowrap font-medium"
          :class="[useStyles().linkActiveState, useStyles().textSizeBase]"
          >¿Aún no tienes cuenta?</NuxtLink
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
        class="mb-6"
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
                class="z-10 h-5 w-5 cursor-pointer md:h-6 md:w-6"
                :class="[
                  error ? useStyles().textColorError : useStyles().textColorPrimary,
                  passwordVisibility ? 'hidden' : undefined,
                ]"
                @click="passwordVisibility = true"
              />
              <UIcon
                name="i-solar-eye-closed-broken"
                class="relative top-0.5 z-10 h-5 w-5 cursor-pointer md:h-6 md:w-6"
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

      <!-- Submit -->
      <UButton
        type="submit"
        size="md"
        block
        :ui="useUIConfigs().acceptButtonConfig"
        class="mb-6 font-bold"
        >Ingresar</UButton
      >

      <!-- Mobile CTA's -->
      <section class="flex flex-col items-center lg:hidden">
        <NuxtLink
          :to="{ name: 'auth-register' }"
          class="w-min text-nowrap font-medium"
          :class="[useStyles().linkActiveState, useStyles().textSizeBase]"
          >¿Aún no tienes cuenta?</NuxtLink
        >
      </section>
    </UForm>

    <!-- Bad Credentials Error -->
    <ModalMinimalError
      ref="badCredentialsErrorModal"
      title="Credenciales incorrectas"
      body="El correo electrónico o la contraseña que has ingresado son incorrectos. Verifica tus datos e inténtalo nuevamente."
    />

    <!-- Bad Request Error -->
    <ModalMinimalError
      ref="badRequestErrorModal"
      title="Error de solicitud"
      body="Estamos afrontando dificultades para procesar tu solicitud. Por favor, refresca esta página e inténtalo más tarde."
    />
  </UContainer>
</template>
