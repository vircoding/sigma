<script setup lang="ts">
import {
  BadCredentialsError,
  BadRequestError,
  FormFieldError,
} from '~/models/classes/client/Error';
import { loginSchema, type LoginSchema } from '~/models/schemas/client/LoginSchema';
import type { LoginInput } from '~/models/types/User';

defineEmits<{
  (e: 'resetPassword'): void;
}>();

const { login } = useAuth();
const { openSubmitLoading, closeSubmitLoading } = useGlobal();
const toast = useToast();

const badCredentialsErrorModal = useTemplateRef('badCredentials');
const badRequestErrorModal = useTemplateRef('badRequest');

const errorVisibility = ref(false);

const state = reactive<LoginInput>({
  email: '',
  password: '',
});

const { handleSubmit, isSubmitting } = useForm<LoginSchema>({
  validationSchema: toTypedSchema(loginSchema),
});

const onSubmit = handleSubmit(
  async (values) => {
    try {
      openSubmitLoading();

      await login(values);
      await navigateTo({ name: 'index' });
      toast.add({
        timeout: 4000,
        title: 'Sesión Iniciada',
      });
    } catch (error) {
      if (error instanceof BadCredentialsError) {
        badCredentialsErrorModal.value?.openModal();
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
          Iniciar sesión
        </h2>
        <p>Ingresa los datos y accede a Sigma con tu cuenta.</p>
      </section>

      <!-- Desktop CTA's -->
      <section class="hidden flex-col lg:flex">
        <button
          type="button"
          class="w-min text-nowrap font-medium"
          :class="[useStyles().linkActiveState]"
          @click.prevent="$emit('resetPassword')"
        >
          ¿Olvidaste tu contraseña?
        </button>

        <NuxtLink
          :to="{ name: 'auth-register' }"
          class="w-min text-nowrap font-medium"
          :class="[useStyles().linkActiveState]"
          >¿Aún no tienes cuenta?</NuxtLink
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
        :error-visibility="errorVisibility"
        name="password"
        class="mb-6"
      />

      <!-- Submit -->
      <UButton
        type="submit"
        size="md"
        block
        :disabled="isSubmitting"
        :ui="useUIConfigs().acceptButtonConfig"
        class="mb-6 font-bold lg:mb-0"
        >Ingresar</UButton
      >

      <!-- Mobile CTA's -->
      <section class="flex flex-col items-center lg:hidden">
        <button
          type="button"
          class="w-min text-nowrap font-medium"
          :class="[useStyles().linkActiveState]"
          @click.prevent="$emit('resetPassword')"
        >
          ¿Olvidaste tu contraseña?
        </button>

        <NuxtLink
          :to="{ name: 'auth-register' }"
          class="w-min text-nowrap font-medium"
          :class="[useStyles().linkActiveState]"
          >¿Aún no tienes cuenta?</NuxtLink
        >
      </section>
    </div>

    <!-- Bad Credentials Error -->
    <ModalMinimalError
      ref="badCredentials"
      title="Credenciales incorrectas"
      body="El correo electrónico o la contraseña que has ingresado son incorrectos. Verifica tus datos e inténtalo nuevamente."
    />

    <!-- Bad Request Error -->
    <ModalMinimalError
      ref="badRequest"
      title="Error de solicitud"
      body="Estamos afrontando dificultades para procesar tu solicitud. Por favor, refresca esta página e inténtalo más tarde."
    />
  </UForm>
</template>
