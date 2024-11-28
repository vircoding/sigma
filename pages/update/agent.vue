<script setup lang="ts">
import { ZodError } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { updateAgentSchema } from '~/models/ValSchema';
import { ModalLoadingAnimation, ModalMinimalError } from '#components';
import {
  AccessTokenExpiredError,
  BadRequestError,
  FormFieldError,
  MaxSizeError,
} from '~/models/Error';
import parsePhoneNumber from 'libphonenumber-js';

definePageMeta({
  middleware: ['auth', 'agent'],
});

type ErrorItem = {
  error: boolean;
  message?: string;
};

type BackendErrorField = 'avatar' | 'firstname' | 'lastname' | 'phone' | 'bio';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const { updateAgent, refresh } = useAuth();

const modals = useModal();
const countries = useCountries().countries;

const badRequestErrorModal = ref<InstanceType<typeof ModalMinimalError>>();

const state = reactive({
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
  avatar: ErrorItem;
  firstname: ErrorItem;
  lastname: ErrorItem;
  phone: ErrorItem;
  bio: ErrorItem;
}>(() => {
  try {
    const input: {
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

    updateAgentSchema.parse(input);
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

      const avatarErrors = fields.filter((value) => value.field === 'avatar');
      const firstnameErrors = fields.filter((value) => value.field === 'firstname');
      const lastnameErrors = fields.filter((value) => value.field === 'lastname');
      const phoneErrors = fields.filter(
        (value) => value.field === 'phone' || value.field === 'code',
      );
      const bioErrors = fields.filter((value) => value.field === 'bio');

      return {
        avatar: { error: avatarErrors.length !== 0, message: avatarErrors[0]?.message },
        firstname: { error: firstnameErrors.length !== 0, message: firstnameErrors[0]?.message },
        lastname: { error: lastnameErrors.length !== 0, message: lastnameErrors[0]?.message },
        phone: { error: phoneErrors.length !== 0, message: phoneErrors[0]?.message },
        bio: { error: bioErrors.length !== 0, message: bioErrors[0]?.message },
      };
    }

    return {
      avatar: { error: true },
      firstname: { error: true },
      lastname: { error: true },
      phone: { error: true },
      bio: { error: true },
    };
  }
});

const blobError = computed(() => {
  if (blob.value && (blob.value.type !== 'image/jpeg' || blob.value.size > 4.5 * 1024 * 1024))
    return true;
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

function turnAllErrorsVisible() {
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

    if (user.value?.type !== 'agent') throw showError(createError({ status: 500 }));

    const body = {
      fistname: user.value.firstname !== event.data.firstname ? event.data.firstname : undefined,
      lastname: user.value.lastname !== event.data.lastname ? event.data.lastname : undefined,
      bio: user.value.bio !== event.data.bio ? event.data.bio : undefined,
      phone:
        user.value.phone !== `+${code.value.callingCode}${phone.value}`
          ? `+${code.value.callingCode}${phone.value}`
          : undefined,
      avatar: blob.value ? blob.value : undefined,
    };

    let hasAnyChange = false;

    for (const key of Object.keys(body) as Array<keyof typeof body>) {
      if (body[key] !== undefined) {
        hasAnyChange = true;
      }
    }

    if (hasAnyChange) {
      try {
        await updateAgent(body);
        useRouter().back();
      } catch (error) {
        if (error instanceof MaxSizeError) {
          setBackendError('avatar');
        } else if (error instanceof BadRequestError) {
          badRequestErrorModal.value?.openModal();
        } else if (error instanceof FormFieldError) {
          const fields = error.fields.map((value) => value.field);
          let anyField = false;
          fields.forEach((field) => {
            if (['firstname', 'lastname', 'avatar', 'phone', 'bio'].includes(field)) {
              anyField = true;
              setBackendError(field as BackendErrorField);
            }
          });
          if (!anyField) badRequestErrorModal.value?.openModal();
        } else if (error instanceof AccessTokenExpiredError) {
          await refresh().catch(() => showError(createError({ status: 500 })));
          await updateAgent(body);
        } else showError(createError({ status: 500 }));
      } finally {
        await modals.close();
      }
    }
    await modals.close();
  }
}

function setData() {
  resetBackendError('avatar');
  resetBackendError('firstname');
  resetBackendError('lastname');
  resetBackendError('phone');
  resetBackendError('bio');

  if (user.value?.type === 'agent') {
    const parsedPhone = parsePhoneNumber(user.value.phone);

    if (parsedPhone) {
      const country = countries.find(
        (country) => country.code === parsedPhone.country?.toLowerCase(),
      );

      if (country) {
        code.value = country;
        phone.value = parsedPhone.nationalNumber;
      } else throw showError(createError({ status: 500 }));
    } else throw showError(createError({ status: 500 }));

    state.firstname = user.value.firstname;
    state.lastname = user.value.lastname;
    state.bio = user.value.bio;
    avatarURL.value = user.value.avatar;
  } else throw showError(createError({ status: 500 }));
}

onMounted(() => {
  setData();
});
</script>

<template>
  <UContainer class="w-full" :class="[useStyles().pageContainer]">
    <div class="lg:hidden">
      <!-- Hero -->
      <section class="mb-7 flex flex-col gap-2">
        <h2
          class="font-ubuntu font-bold"
          :class="[useStyles().textColorPrimary, useStyles().textSize4XL]"
        >
          Edita tu cuenta
        </h2>
        <p>Actualiza los datos de tu perfil y acércate aún más a tus clientes potenciales.</p>
      </section>
    </div>

    <!-- Form -->
    <UForm
      :state="state"
      class="auto-cols-auto grid-cols-2 grid-rows-1 lg:grid lg:gap-x-12 xl:gap-x-20"
      @submit="onSubmit"
    >
      <div class="col-start-1 flex flex-col justify-end">
        <div class="top-0 mb-4 hidden flex-col gap-5 lg:flex">
          <!-- Hero -->
          <section class="flex flex-col gap-2">
            <h2
              class="font-ubuntu font-bold"
              :class="[useStyles().textColorPrimary, useStyles().textSize4XL]"
            >
              Edita tu cuenta
            </h2>
            <p>Actualiza los datos de tu perfil y acércate aún más a tus clientes potenciales.</p>
          </section>
        </div>

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
            class="w-min lg:mb-0"
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
        <div class="mb-4 flex justify-between gap-x-3 lg:mb-0">
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
                @blur="errorVisibility.phone = true"
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

                <template #option-empty="{ query }">
                  <span :class="[useStyles().textColorSecondary, useStyles().textSizeXS]"
                    >Sin resultados: <q>{{ query }}</q></span
                  >
                </template>

                <template #empty
                  ><span :class="[useStyles().textColorSecondary, useStyles().textSizeXS]"
                    >Cargando...</span
                  ></template
                >
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
      </div>

      <div class="col-start-2">
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
              placeholder="Sin Descripción"
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

        <div class="col-start-2 lg:mt-6">
          <div class="grid grid-cols-2 gap-x-4">
            <!-- Reset -->
            <UButton
              label="Restablecer"
              variant="solid"
              size="md"
              block
              :ui="useUIConfigs().cancelButtonConfig"
              class="font-bold"
              @click="setData"
            />

            <!-- Submit -->
            <UButton
              type="submit"
              label="Guardar"
              variant="solid"
              size="md"
              block
              :ui="useUIConfigs().acceptButtonConfig"
              class="font-bold"
            />
          </div>
        </div>
      </div>
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
