<script setup lang="ts">
import { ZodError } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { registerAgentSchema, type RegisterAgentSchema } from '~/schemas/register';

type ErrorItem = {
  error: boolean;
  message?: string;
};

const errors = computed<{
  email: ErrorItem;
  password: ErrorItem;
  repassword: ErrorItem;
  firstname: ErrorItem;
  lastname: ErrorItem;
  phone: ErrorItem;
  bio: ErrorItem;
}>(() => {
  try {
    const input: {
      email: string;
      password: string;
      repassword: string;
      firstname: string;
      lastname: string;
      bio: string;
      code: string;
      phone: string;
    } = { ...state, code: code.value.code, phone: phone.value };

    registerAgentSchema.parse(input);
    return {
      email: { error: false },
      password: { error: false },
      repassword: { error: false },
      firstname: { error: false },
      lastname: { error: false },
      phone: { error: false },
      bio: { error: false },
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
      const firstnameErrors = fields.filter((value) => value.field === 'firstname');
      const lastnameErrors = fields.filter((value) => value.field === 'lastname');
      const phoneErrors = fields.filter(
        (value) => value.field === 'phone' || value.field === 'code',
      );
      const bioErrors = fields.filter((value) => value.field === 'bio');

      return {
        email: { error: emailErrors.length !== 0, message: emailErrors[0]?.message },
        password: { error: passwordErrors.length !== 0, message: passwordErrors[0]?.message },
        repassword: { error: repasswordErrors.length !== 0, message: repasswordErrors[0]?.message },
        firstname: { error: firstnameErrors.length !== 0, message: firstnameErrors[0]?.message },
        lastname: { error: lastnameErrors.length !== 0, message: lastnameErrors[0]?.message },
        phone: { error: phoneErrors.length !== 0, message: phoneErrors[0]?.message },
        bio: { error: bioErrors.length !== 0, message: bioErrors[0]?.message },
      };
    }

    return {
      email: { error: true },
      password: { error: true },
      repassword: { error: true },
      firstname: { error: true },
      lastname: { error: true },
      phone: { error: true },
      bio: { error: true },
    };
  }
});

const errorVisibility = ref({
  email: false,
  password: false,
  repassword: false,
  firstname: false,
  lastname: false,
  phone: false,
  bio: false,
});

const state = reactive({
  email: '',
  password: '',
  repassword: '',
  firstname: '',
  lastname: '',
  bio: '',
});

const code = ref({
  code: 'cu',
  esName: 'Cuba',
  enName: 'Cuba',
  callingCode: '53',
});

const phone = ref('');

const passwordVisibility = ref(false);

function turnAllErrorsVisible() {
  errorVisibility.value.email = true;
  errorVisibility.value.password = true;
  errorVisibility.value.repassword = true;
  errorVisibility.value.firstname = true;
  errorVisibility.value.lastname = true;
  errorVisibility.value.phone = true;
  errorVisibility.value.bio = true;
}

const countries = useCountries().countries;

function removeAccents(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function search(q: string) {
  return countries.filter(
    (value) =>
      removeAccents(value.esName).toLowerCase().includes(removeAccents(q.toLowerCase())) ||
      removeAccents(value.enName).toLowerCase().includes(removeAccents(q.toLowerCase())) ||
      `+${value.callingCode}`.includes(q),
  );
}

async function onSubmit(event: FormSubmitEvent<RegisterAgentSchema>) {
  turnAllErrorsVisible();

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
          Regístrate como Agente
        </h2>
        <p>Crea tu cuenta como Agente si deseas vender o rentar más de una casa.</p>
      </section>

      <!-- Desktop CTA's -->
      <section class="hidden flex-col gap-1 lg:flex">
        <span
          class="w-min text-nowrap font-medium"
          :class="[useStyles().textColorPrimary, useStyles().textSizeLG]"
          >¿Ya tienes cuenta?</span
        >
        <NuxtLink
          :to="{ name: 'auth-register-client' }"
          class="w-min text-nowrap font-medium"
          :class="[useStyles().textColorPrimary, useStyles().textSizeLG]"
          >¿No eres agente?</NuxtLink
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
        class="mb-4"
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

      <div class="mb-4 flex gap-2 min-[375px]:gap-4">
        <!-- Avatar -->
        <div
          class="relative top-3 aspect-square w-24 min-w-24 min-[375px]:w-28 min-[375px]:min-w-28"
        >
          <div class="overflow-hidden rounded-full border border-gray-300">
            <PlaceholderAvatar class="h-full w-full text-gray-300" />
          </div>
        </div>

        <div class="flex grow flex-col">
          <!-- Firstname -->
          <UFormGroup
            size="md"
            label="Nombre"
            name="firstname"
            :error="errors.firstname.error && errorVisibility.firstname && errors.firstname.message"
            class="mb-4"
          >
            <template #default="{ error }">
              <UInput
                v-model="state.firstname"
                size="md"
                type="text"
                :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
                @blur="errorVisibility.firstname = true"
              />
            </template>

            <template #error="{ error }">
              <span class="text-red-500 dark:text-red-400" :class="[useStyles().textSizeSM]">
                {{ error }}
              </span>
            </template>
          </UFormGroup>

          <!-- Lastname -->
          <UFormGroup
            size="md"
            label="Apellidos"
            name="lastname"
            :error="errors.lastname.error && errorVisibility.lastname && errors.lastname.message"
          >
            <template #default="{ error }">
              <UInput
                v-model="state.lastname"
                size="md"
                type="text"
                :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
                @blur="errorVisibility.lastname = true"
              />
            </template>

            <template #error="{ error }">
              <span class="text-red-500 dark:text-red-400" :class="[useStyles().textSizeSM]">
                {{ error }}
              </span>
            </template>
          </UFormGroup>
        </div>
      </div>

      <!-- Whatsapp -->
      <div class="mb-4 flex justify-between gap-4">
        <!-- Code -->
        <UFormGroup
          size="md"
          label="Whatsapp"
          name="phone"
          :error="errors.phone.error && errorVisibility.phone && errors.phone.message"
        >
          <template #default>
            <USelectMenu
              v-model="code"
              :searchable="search"
              placeholder="Código del país"
              :options="countries"
              clear-search-on-close
              :ui="{ wrapper: 'w-28' }"
              :ui-menu="{ width: 'w-[calc(100vw-64px)]', base: 'relative' }"
              searchable-placeholder="Código del país"
            >
              <template #label>
                <div class="flex items-center gap-2">
                  <div class="flex min-h-4 min-w-5 overflow-hidden rounded-sm">
                    <img
                      :src="`https://flagcdn.com/w20/${code.code}.png`"
                      :srcset="`https://flagcdn.com/w40/${code.code}.png 2x`"
                      width="20"
                      alt="Cayman Islands"
                    />
                  </div>
                  <div class="flex w-min min-w-9 justify-center">
                    <span>+{{ code.callingCode }}</span>
                  </div>
                </div>
              </template>

              <template #option="{ option }">
                <div class="flex min-h-4 min-w-5 overflow-hidden rounded-sm">
                  <img
                    :src="`https://flagcdn.com/w20/${option.code}.png`"
                    :srcset="`https://flagcdn.com/w40/${option.code}.png 2x`"
                    width="20"
                    alt="Cayman Islands"
                  />
                </div>
                <div class="w-min min-w-9">
                  <span>+{{ option.callingCode }}</span>
                </div>
                <span class="truncate">{{ option.esName }}</span>
              </template>
            </USelectMenu>
          </template>

          <template #error="{ error }">
            <div class="relative h-4 md:h-[22px]">
              <span
                class="absolute text-nowrap text-red-500 dark:text-red-400"
                :class="[useStyles().textSizeSM]"
              >
                {{ error }}
              </span>
            </div>
          </template>
        </UFormGroup>

        <!-- Phone -->
        <UFormGroup
          size="md"
          name="phone"
          :error="errors.phone.error && errorVisibility.phone && errors.phone.message"
          class="relative top-5 w-full md:top-[22px]"
        >
          <template #default="{ error }">
            <UInput
              v-model="phone"
              size="md"
              type="tel"
              :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
              @blur="errorVisibility.phone = true"
            />
          </template>

          <template #error></template>
        </UFormGroup>
      </div>

      <!-- Bio -->
      <UFormGroup
        size="md"
        label="Biografía"
        name="bio"
        :error="errors.bio.error && errorVisibility.bio && errors.bio.message"
        class="mb-6"
      >
        <template #default="{ error }">
          <UTextarea
            v-model="state.bio"
            size="md"
            :rows="9"
            type="text"
            :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
            @blur="errorVisibility.bio = true"
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
    </UForm>
  </UContainer>
</template>
