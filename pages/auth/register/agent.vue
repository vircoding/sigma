<script setup lang="ts">
import { ZodError } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { registerAgentSchema } from '~/models/ValSchema';
import { ModalLoadingAnimation, ModalMinimalError, UIVerify } from '#components';
import {
  BadRequestError,
  ConflictError,
  FormFieldError,
  MaxSizeError,
  BadCredentialsError,
} from '~/models/Error';

type ErrorItem = {
  error: boolean;
  message?: string;
};

type BackendErrorField =
  | 'email'
  | 'password'
  | 'repassword'
  | 'avatar'
  | 'firstname'
  | 'lastname'
  | 'phone'
  | 'bio';

const { registerAgent, resendVerificationEmail, login } = useAuth();

const modals = useModal();
const countries = useCountries().countries;
const isVerify = ref(false);
const canLogin = ref(false);

const conflictErrorModal = ref<InstanceType<typeof ModalMinimalError>>();
const badRequestErrorModal = ref<InstanceType<typeof ModalMinimalError>>();
const verifyComponent = ref<InstanceType<typeof UIVerify>>();

const state = reactive({
  email: '',
  password: '',
  repassword: '',
  firstname: '',
  lastname: '',
  bio: '',
});

const avatarURL = ref<string | undefined>();
const blob = ref<Blob | undefined>();
const phone = ref('');
const code = ref<{
  code: string;
  esName: string;
  enName: string;
  callingCode: string;
}>(countries[0]);

const backendErrors = ref<{
  email: boolean;
  password: boolean;
  repassword: boolean;
  avatar: boolean;
  firstname: boolean;
  lastname: boolean;
  phone: boolean;
  bio: boolean;
}>({
  email: false,
  password: false,
  repassword: false,
  avatar: false,
  firstname: false,
  lastname: false,
  phone: false,
  bio: false,
});

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

const blobError = computed(() => {
  if (blob.value?.type !== 'image/jpeg' || blob.value?.size > 4.5 * 1024 * 1024) return true;
  return false;
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

watch(code, () => {
  resetBackendError('phone');
});

function $reset() {
  state.email = '';
  state.password = '';
  state.repassword = '';
  state.firstname = '';
  state.lastname = '';
  state.bio = '';
  avatarURL.value = undefined;
  phone.value = '';
  code.value = countries[0];

  resetBackendError('email');
  resetBackendError('password');
  resetBackendError('repassword');
  resetBackendError('avatar');
  resetBackendError('firstname');
  resetBackendError('lastname');
  resetBackendError('phone');
  resetBackendError('bio');

  errorVisibility.value.email = false;
  errorVisibility.value.password = false;
  errorVisibility.value.repassword = false;
  errorVisibility.value.avatar = false;
  errorVisibility.value.firstname = false;
  errorVisibility.value.lastname = false;
  errorVisibility.value.phone = false;
  errorVisibility.value.bio = false;

  passwordVisibility.value = false;
}

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

function resetBackendError(field: BackendErrorField) {
  backendErrors.value[field] = false;
}

function setBackendError(field: BackendErrorField) {
  backendErrors.value[field] = true;
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

function handleCrop(imageURL: string, file: Blob) {
  avatarURL.value = imageURL;
  blob.value = file;
  resetBackendError('avatar');
  errorVisibility.value.avatar = true;
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  turnAllErrorsVisible();

  if (!Object.values(errors.value).some((field) => field.error)) {
    modals.open(ModalLoadingAnimation);

    try {
      await registerAgent({
        avatar: blob.value,
        phone: `+${code.value.callingCode}${phone.value}`,
        ...event.data,
      });

      isVerify.value = true;
    } catch (error) {
      if (error instanceof MaxSizeError) {
        setBackendError('avatar');
      } else if (error instanceof ConflictError) {
        conflictErrorModal.value?.openModal();
      } else if (error instanceof BadRequestError) {
        badRequestErrorModal.value?.openModal();
      } else if (error instanceof FormFieldError) {
        const fields = error.fields.map((value) => value.field);
        let anyField = false;
        fields.forEach((field) => {
          if (
            [
              'email',
              'password',
              'repassword',
              'firstname',
              'lastname',
              'avatar',
              'phone',
              'bio',
            ].includes(field)
          ) {
            anyField = true;
            setBackendError(field as BackendErrorField);
          }
        });
        if (!anyField) badRequestErrorModal.value?.openModal();
      } else showError(createError({ status: 500 }));
    } finally {
      await modals.close();
    }
  }
}

async function handleResendVerificationEmail() {
  modals.open(ModalLoadingAnimation);
  try {
    await resendVerificationEmail(state.email);
  } catch (error) {
    if (!(error instanceof ConflictError)) showError(createError({ status: 500 }));
  } finally {
    verifyComponent.value?.disableAndRestart();
    await modals.close();
  }
}

async function handleReturn() {
  if (!canLogin.value) {
    canLogin.value = true;

    const loginInterval = setInterval(async () => {
      if (canLogin.value) {
        try {
          await login({ email: state.email, password: state.password });
          canLogin.value = false;
          clearInterval(loginInterval);
          await navigateTo({ name: 'index' });
        } catch (error) {
          if (!(error instanceof BadCredentialsError)) showError(createError({ status: 500 }));
        }
      } else {
        clearInterval(loginInterval);
      }
    }, 10000);
  }
}

onUnmounted(() => {
  canLogin.value = false;
  $reset();
});
</script>

<template>
  <div>
    <!-- Verify -->
    <UIVerify
      v-if="isVerify"
      ref="verifyComponent"
      @resend="handleResendVerificationEmail"
      @return="handleReturn"
    />

    <!-- View -->
    <UContainer v-else class="w-full" :class="[useStyles().pageContainer]">
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
            <section class="hidden flex-col lg:flex">
              <NuxtLink
                :to="{ name: 'auth-login' }"
                class="w-min text-nowrap font-medium"
                :class="[useStyles().linkActiveState, useStyles().textSizeBase]"
                >¿Ya tienes cuenta?</NuxtLink
              >
              <NuxtLink
                :to="{ name: 'auth-register-client' }"
                class="w-min text-nowrap font-medium"
                :class="[useStyles().linkActiveState, useStyles().textSizeBase]"
                >¿No eres agente?</NuxtLink
              >
            </section>
          </div>

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
                @input="resetBackendError('email')"
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
                @input="resetBackendError('password')"
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
              (backendErrors.repassword && 'Debe ser una contraseña válida') ||
              (errors.repassword.error && errorVisibility.repassword && errors.repassword.message)
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
                @input="resetBackendError('repassword')"
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
              :error="
                (backendErrors.avatar && 'No válido') ||
                (blobError && errorVisibility.avatar && 'No válido') ||
                (errors.avatar.error && errorVisibility.avatar && errors.avatar.message)
              "
              class="mb-4 w-min lg:mb-0"
            >
              <template #label="{ label }">
                <span class="invisible">{{ label }}</span>
              </template>

              <InputAvatar
                :avatar="avatarURL"
                :error="
                  backendErrors.avatar ||
                  (blobError && errorVisibility.avatar) ||
                  (errors.avatar.error && errorVisibility.avatar)
                "
                @crop="handleCrop"
                @change="resetBackendError('avatar')"
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
                  (backendErrors.firstname && 'Este nombre no es válido') ||
                  (errors.firstname.error && errorVisibility.firstname && errors.firstname.message)
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
                    @input="resetBackendError('firstname')"
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
                :error="
                  (backendErrors.lastname && 'Los apellidos no son válidos') ||
                  (errors.lastname.error && errorVisibility.lastname && errors.lastname.message)
                "
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
                    @input="resetBackendError('lastname')"
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
              :error="
                (backendErrors.phone && 'Debe ser un teléfono válido') ||
                (errors.phone.error && errorVisibility.phone && errors.phone.message)
              "
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
              :error="
                (backendErrors.phone && 'Debe ser un teléfono válido') ||
                (errors.phone.error && errorVisibility.phone && errors.phone.message)
              "
              class="relative top-5 w-full md:top-[22px]"
            >
              <template #default="{ error }">
                <UInput
                  v-model.trim="phone"
                  size="md"
                  type="tel"
                  :trailing-icon="error ? 'i-heroicons-exclamation-circle' : undefined"
                  @input="resetBackendError('phone')"
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
            :error="
              (backendErrors.bio && 'La biografía no es válida') ||
              (errors.bio.error && errorVisibility.bio && errors.bio.message)
            "
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
                @input="resetBackendError('bio')"
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
        </div>

        <!-- Mobile CTA's -->
        <section class="flex flex-col items-center lg:hidden">
          <NuxtLink
            :to="{ name: 'auth-login' }"
            class="w-min text-nowrap font-medium"
            :class="[useStyles().linkActiveState, useStyles().textSizeBase]"
            >¿Ya tienes cuenta?</NuxtLink
          >
          <NuxtLink
            :to="{ name: 'auth-register-client' }"
            class="w-min text-nowrap font-medium"
            :class="[useStyles().linkActiveState, useStyles().textSizeBase]"
            >¿No eres agente?</NuxtLink
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
  </div>
</template>
