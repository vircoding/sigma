<script setup lang="ts">
import { ZodError } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { registerAgentSchema, type RegisterAgentSchema } from '~/schemas/register';

const countries = useCountries().countries;

type ErrorItem = {
  error: boolean;
  message?: string;
};

const errors = computed<{
  email: ErrorItem;
  password: ErrorItem;
  repassword: ErrorItem;
  avatar: ErrorItem;
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
      avatar?: string;
    } = {
      ...state,
      code: code.value.callingCode,
      phone: phone.value,
      avatar: avatarURL.value ? avatarURL.value : '',
    };

    registerAgentSchema.parse(input);
    return {
      email: { error: false },
      password: { error: false },
      repassword: { error: false },
      avatar: { error: false },
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
      const avatarErrors = fields.filter((value) => value.field === 'avatar');
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
        avatar: { error: avatarErrors.length !== 0, message: avatarErrors[0]?.message },
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
      avatar: { error: true },
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
  avatar: false,
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

const avatarURL = ref<string | undefined>();

const code = ref<{
  code: string;
  esName: string;
  enName: string;
  callingCode: string;
}>(countries[0]);

const phone = ref('');

const passwordVisibility = ref(false);

function turnAllErrorsVisible() {
  errorVisibility.value.email = true;
  errorVisibility.value.password = true;
  errorVisibility.value.repassword = true;
  errorVisibility.value.avatar = true;
  errorVisibility.value.firstname = true;
  errorVisibility.value.lastname = true;
  errorVisibility.value.phone = true;
  errorVisibility.value.bio = true;
}

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

function handleCrop(imageURL: string) {
  avatarURL.value = imageURL;
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
  <UContainer :class="[useStyles().pageContainer]">
    <div class="lg:hidden">
      <!-- Hero -->
      <section class="mb-7 flex flex-col gap-2">
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
    <UForm
      :state="state"
      class="auto-cols-auto grid-cols-2 grid-rows-2 lg:grid lg:gap-x-12 xl:gap-x-20"
      @submit="onSubmit"
    >
      <div class="col-start-1 row-span-2 row-start-1 self-end">
        <div class="top-0 mb-12 hidden flex-col gap-5 lg:flex">
          <!-- Hero -->
          <section class="flex flex-col gap-2">
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

        <!-- Email -->
        <UFormGroup
          size="md"
          label="Correo Electrónico"
          name="email"
          :error="errors.email.error && errorVisibility.email && errors.email.message"
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
          :error="errors.password.error && errorVisibility.password && errors.password.message"
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
                  class="h-5 w-5 cursor-pointer md:h-6 md:w-6"
                  :class="[
                    error ? useStyles().textColorError : useStyles().textColorPrimary,
                    passwordVisibility ? 'hidden' : undefined,
                  ]"
                  @click="passwordVisibility = true"
                />
                <UIcon
                  name="i-solar-eye-closed-broken"
                  class="relative top-0.5 h-5 w-5 cursor-pointer md:h-6 md:w-6"
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
            errors.repassword.error && errorVisibility.repassword && errors.repassword.message
          "
          class="mb-4 lg:mb-0"
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
      </div>

      <div class="col-start-2 row-span-2 row-start-1">
        <div class="mb-4 flex gap-2">
          <!-- Avatar -->
          <UFormGroup
            size="md"
            label="Avatar"
            name="avatar"
            :error="errors.avatar.error && errorVisibility.avatar && errors.avatar.message"
            class="mb-4 w-min lg:mb-0"
          >
            <template #label="{ label }">
              <span class="invisible">{{ label }}</span>
            </template>

            <InputAvatar
              :avatar="avatarURL"
              :error="errors.avatar.error && errorVisibility.avatar"
              @crop="handleCrop"
              @blur="errorVisibility.avatar = true"
            />

            <template #error="{ error }">
              <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
                {{ error }}
              </span>
            </template>
          </UFormGroup>

          <div class="flex grow flex-col">
            <!-- Firstname -->
            <UFormGroup
              size="md"
              label="Nombre"
              name="firstname"
              :error="
                errors.firstname.error && errorVisibility.firstname && errors.firstname.message
              "
              class="mb-4"
            >
              <template #label="{ label, error }">
                <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
              </template>

              <template #default="{ error }">
                <UInput
                  v-model.trim="state.firstname"
                  size="md"
                  type="text"
                  :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
                  @blur="errorVisibility.firstname = true"
                />
              </template>

              <template #error="{ error }">
                <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
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
              <template #label="{ label, error }">
                <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
              </template>

              <template #default="{ error }">
                <UInput
                  v-model.trim="state.lastname"
                  size="md"
                  type="text"
                  :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
                  @blur="errorVisibility.lastname = true"
                />
              </template>

              <template #error="{ error }">
                <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
                  {{ error }}
                </span>
              </template>
            </UFormGroup>
          </div>
        </div>

        <!-- Whatsapp -->
        <div class="mb-4 flex justify-between gap-2">
          <!-- Code -->
          <UFormGroup
            size="md"
            label="Whatsapp"
            name="phone"
            :error="errors.phone.error && errorVisibility.phone && errors.phone.message"
          >
            <template #label="{ label, error }">
              <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
            </template>

            <template #default="{ error }">
              <USelectMenu
                v-model.trim="code"
                :searchable="search"
                placeholder="Código del país"
                :options="countries"
                clear-search-on-close
                selected-icon="i-solar-check-circle-bold"
                :ui="useUIConfigs().countrySelectConfig"
                :ui-menu="useUIConfigs().countrySelectMenuConfig"
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

                <template #trailing>
                  <UIcon
                    name="i-heroicons-chevron-down-20-solid"
                    class="h-5 w-5"
                    :class="[error ? useStyles().textColorError : useStyles().textColorPrimary]"
                  />
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
                  class="absolute text-nowrap"
                  :class="[useStyles().textSizeSM, useStyles().textColorError]"
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
                v-model.trim="phone"
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
          label="Biografía (Opcional)"
          name="bio"
          :error="errors.bio.error && errorVisibility.bio && errors.bio.message"
          class="mb-6 lg:mb-0"
        >
          <template #label="{ label, error }">
            <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
          </template>

          <template #hint="{ error }">
            <span
              class="mr-2"
              :class="[
                useStyles().textSizeXS,
                error ? useStyles().textColorError : useStyles().textColorPrimary,
              ]"
              >{{ state.bio.length }}/250 caracteres</span
            >
          </template>

          <template #default="{ error }">
            <UTextarea
              v-model.trim="state.bio"
              size="md"
              :rows="9"
              type="text"
              :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
              @blur="errorVisibility.bio = true"
            />
          </template>

          <template #error="{ error }">
            <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
              {{ error }}
            </span>
          </template>
        </UFormGroup>
      </div>

      <div class="col-start-2 row-start-3 lg:mt-6">
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
      </div>

      <!-- Mobile CTA's -->
      <section class="flex flex-col items-center lg:hidden">
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
    </UForm>
  </UContainer>
</template>
