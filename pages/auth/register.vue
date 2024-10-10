<script setup lang="ts">
import { z, ZodError } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const schema = z
  .object({
    email: z
      .string({ message: 'Requerido' })
      .trim()
      .min(1, 'Requerido')
      .email('Debe ser un correo electrónico válido'),
    password: z
      .string({ message: 'Requerido' })
      .trim()
      .min(1, 'Requerido')
      .min(6, 'Debe contener entre 6 y 20 caracteres')
      .max(20, 'Debe contener entre 6 y 20 caracteres'),
    repassword: z.string({ message: 'Requerido' }).trim().min(1, 'Requerido'),
  })
  .refine((data) => data.password === data.repassword, {
    message: 'Passwords do not match',
    path: ['repassword'],
  });

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
    schema.parse(state);
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

type Schema = z.output<typeof schema>;

const state = reactive({
  email: '',
  password: '',
  repassword: '',
});

const passwordVisibility = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
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
  <UContainer>
    <!-- Hero -->
    <section class="mb-7 flex flex-col gap-2">
      <h2 class="font-ubuntu text-3xl font-bold">Regístrate como Propietario</h2>
      <p class="text-gray-500 dark:text-gray-400">
        Crea tu cuenta como Propietario si deseas vender o rentar tu casa.
      </p>
    </section>

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
          <span class="text-sm text-red-500 dark:text-red-400">
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
                class="mr-2 h-5 w-5 text-red-500 dark:text-red-400"
              />
              <UIcon
                v-if="!passwordVisibility"
                name="i-solar-eye-broken"
                class="z-50 h-5 w-5 cursor-pointer"
                :class="[
                  error ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400',
                ]"
                @click="passwordVisibility = true"
              />
              <UIcon
                v-else
                name="i-solar-eye-closed-broken"
                class="relative top-0.5 z-50 h-5 w-5 cursor-pointer"
                :class="[
                  error ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400',
                ]"
                @click="passwordVisibility = false"
              />
            </template>
          </UInput>
        </template>

        <template #error="{ error }">
          <span class="text-sm text-red-500 dark:text-red-400">
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
          <span class="text-sm text-red-500 dark:text-red-400">
            {{ error }}
          </span>
        </template>
      </UFormGroup>

      <UButton type="submit" size="md" block class="mb-6 font-semibold">Registrarse</UButton>

      <div class="px-4 text-center text-xs">
        <p class="text-gray-500 dark:text-gray-400">
          Al registrarte en nuestro sitio, aceptas nuestras
          <span class="font-bold text-azure-950 dark:text-gray-200">políticas de cookies</span> y
          <span class="font-bold text-azure-950 dark:text-gray-200">privacidad</span>.
        </p>
      </div>
    </UForm>
  </UContainer>
</template>
