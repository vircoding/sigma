<script setup lang="ts">
import { ZodError } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { registerSchema, type RegisterSchema } from '~/schemas/register';

const errors = computed<{
  email: {
    error: boolean;
    message?: string;
  };
  password: {
    error: boolean;
    message?: string;
  };
  repassword: {
    error: boolean;
    message?: string;
  };
}>(() => {
  try {
    registerSchema.parse(state);
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

const passwordVisibility = ref(false);

async function onSubmit(event: FormSubmitEvent<RegisterSchema>) {
  errorVisibility.value.email = true;
  errorVisibility.value.password = true;
  errorVisibility.value.repassword = true;

  if (!Object.values(errors.value).some((field) => field.error)) {
    // Do something with data
    console.log(event.data);
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
        <span class="font-medium" :class="[useStyles().textColorPrimary, useStyles().textSizeLG]"
          >¿Ya tienes cuenta?</span
        >
        <NuxtLink
          :to="{ name: 'auth-register-agent' }"
          class="font-medium"
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
        :error="errors.email.error && errorVisibility.email && errors.email.message"
        class="mb-4"
      >
        <template #default="{ error }">
          <UInput
            v-model="state.email"
            size="md"
            type="email"
            :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
            @blur="errorVisibility.email = true"
          />
        </template>

        <template #error="{ error }">
          <span class="text-red-500 dark:text-red-400" :class="[useStyles().textSizeSM]">
            {{ error }}
          </span>
        </template>
      </UFormGroup>

      <!-- Password -->
      <UFormGroup
        size="md"
        label="Contraseña"
        name="password"
        :error="errors.password.error && errorVisibility.password && errors.password.message"
        class="mb-4"
      >
        <template #default="{ error }">
          <UInput
            v-model="state.password"
            size="md"
            :type="passwordVisibility ? 'text' : 'password'"
            @blur="errorVisibility.password = true"
          >
            <template #trailing>
              <UIcon
                v-if="error"
                name="i-heroicons-exclamation-circle"
                class="mr-2 h-5 w-5 text-red-500 md:h-6 md:w-6 dark:text-red-400"
              />
              <UIcon
                name="i-solar-eye-broken"
                class="z-50 h-5 w-5 cursor-pointer md:h-6 md:w-6"
                :class="[
                  error ? 'text-red-500 dark:text-red-400' : useStyles().textColorPrimary,
                  passwordVisibility ? 'hidden' : undefined,
                ]"
                @click="passwordVisibility = true"
              />
              <UIcon
                name="i-solar-eye-closed-broken"
                class="relative top-0.5 z-50 h-5 w-5 cursor-pointer md:h-6 md:w-6"
                :class="[
                  error ? 'text-red-500 dark:text-red-400' : useStyles().textColorPrimary,
                  !passwordVisibility ? 'hidden' : undefined,
                ]"
                @click="passwordVisibility = false"
              />
            </template>
          </UInput>
        </template>

        <template #error="{ error }">
          <span class="text-red-500 dark:text-red-400" :class="[useStyles().textSizeSM]">
            {{ error }}
          </span>
        </template>
      </UFormGroup>

      <!-- Repassword -->
      <UFormGroup
        size="md"
        label="Confirmar Contraseña"
        name="repassword"
        :error="errors.repassword.error && errorVisibility.repassword && errors.repassword.message"
        class="mb-6"
      >
        <template #default="{ error }">
          <UInput
            v-model="state.repassword"
            size="md"
            :type="passwordVisibility ? 'text' : 'password'"
            :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
            @blur="errorVisibility.repassword = true"
          />
        </template>

        <template #error="{ error }">
          <span class="text-red-500 dark:text-red-400" :class="[useStyles().textSizeSM]">
            {{ error }}
          </span>
        </template>
      </UFormGroup>

      <!-- Submit -->
      <UButton
        type="submit"
        size="md"
        block
        :ui="useStyles().formSubmitButtonConfig"
        class="mb-6 font-semibold"
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
      <section class="flex flex-col text-center lg:hidden">
        <span class="font-medium" :class="[useStyles().textColorPrimary, useStyles().textSizeLG]"
          >¿Ya tienes cuenta?</span
        >
        <NuxtLink
          :to="{ name: 'auth-register-agent' }"
          class="font-medium"
          :class="[useStyles().textColorPrimary, useStyles().textSizeLG]"
          >¿Eres agente?</NuxtLink
        >
      </section>
    </UForm>
  </UContainer>
</template>
