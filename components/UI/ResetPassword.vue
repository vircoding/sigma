<script setup lang="ts">
import { ZodError } from 'zod';
import { resetPasswordSchema } from '~/models/ValSchema';
import { ModalMinimalError } from '#components';
import { ResetPasswordError, FormFieldError, BadRequestError } from '~/models/Error';

defineEmits<{
  (e: 'cancel'): void;
}>();

const { postResetPassword, putResetPassword, patchResetPassword } = useAuth();

const progressInterval = setInterval(() => {
  if (timer.isRunning.value) {
    timestamp.value = Date.now();
  }
}, 100);

const page = ref<1 | 2 | 3>(1);

const itemList = [
  { label: 'Solicitar código' },
  { label: 'Verificar código' },
  { label: 'Cambiar contraseña' },
];

const paragraphsList = [
  'Proporciona el correo electrónico al cual está registrada tu cuenta y te enviaremos un email con las indicaciones para restablecer tu nueva contraseña.',
  'Ingresa el código que te enviamos para poder verificar que eres el dueño de esta cuenta.',
  'Define una nueva contraseña para tu cuenta. Asegúrate de que sea segura y fácil de recordar.',
];

const submitButtonLabels = ['Solicitar', 'Enviar', 'Guardar'];

const breadcrumbItems = computed(() => {
  return itemList.slice(0, page.value);
});

type ErrorItem = {
  error: boolean;
  message?: string;
};

const isHelpOpen = ref(false);

type BackendErrorField = 'email' | 'password' | 'repassword' | 'pin';

const { openSubmitLoading, closeSubmitLoading } = useGlobal();

const resetPasswordErrorModal = ref<InstanceType<typeof ModalMinimalError>>();
const badRequestErrorModal = ref<InstanceType<typeof ModalMinimalError>>();

const state = reactive({
  email: '',
  password: '',
  repassword: '',
});

const pin = ref(['', '', '', '', '', '']);

const timer = useTimeout(60);
const timestamp = ref(Date.now());
const progress = computed(() => {
  return 100 - (timer.stopTime - timestamp.value) / 600;
});

const backendErrors = ref<{
  email: boolean;
  password: boolean;
  repassword: boolean;
  pin: boolean;
}>({
  email: false,
  password: false,
  repassword: false,
  pin: false,
});

const errors = computed<{
  email: ErrorItem;
  password: ErrorItem;
  repassword: ErrorItem;
  pin: ErrorItem;
}>(() => {
  let pinError: ErrorItem = { error: false };
  if (pin.value.length !== 6 || !pin.value.every((value) => /\d/.test(value)))
    pinError = { error: true };

  try {
    resetPasswordSchema.parse(state);

    return {
      email: { error: false },
      password: { error: false },
      repassword: { error: false },
      pin: pinError,
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
        pin: pinError,
      };
    }

    return {
      email: { error: true },
      password: { error: true },
      repassword: { error: true },
      pin: pinError,
    };
  }
});

const errorVisibility = ref({
  email: false,
  password: false,
  repassword: false,
  pin: false,
});

const passwordVisibility = ref(false);

function resetBackendError(field: BackendErrorField) {
  backendErrors.value[field] = false;
}

function setBackendError(field: BackendErrorField) {
  backendErrors.value[field] = true;
}

const disableButton = computed(() => {
  return timer.isRunning.value;
});

async function submitPage1() {
  errorVisibility.value.email = true;

  if (!errors.value.email.error) {
    openSubmitLoading();

    try {
      await postResetPassword({ email: state.email });

      errorVisibility.value.email = false;
      nextPage();
    } catch (error) {
      if (error instanceof BadRequestError) {
        badRequestErrorModal.value?.openModal();
      } else if (error instanceof FormFieldError) {
        const fields = error.fields.map((value) => value.field);
        let anyField = false;
        fields.forEach((field) => {
          if (['email'].includes(field)) {
            anyField = true;
            setBackendError(field as 'email' | 'password');
          }
        });
        if (!anyField) badRequestErrorModal.value?.openModal();
      } else showError(createError({ status: 500 }));
    } finally {
      closeSubmitLoading();
    }
  }
}

async function submitPage2() {
  errorVisibility.value.email = true;
  errorVisibility.value.pin = true;

  if (!errors.value.email.error && !errors.value.pin.error) {
    openSubmitLoading();
    try {
      await putResetPassword({ email: state.email, code: pin.value.join('') });

      errorVisibility.value.email = false;
      errorVisibility.value.pin = false;
      nextPage();
    } catch (error) {
      if (error instanceof ResetPasswordError) {
        resetPasswordErrorModal.value?.openModal();
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
      closeSubmitLoading();
    }
  }
}

async function submitPage3() {
  errorVisibility.value.email = true;
  errorVisibility.value.password = true;
  errorVisibility.value.repassword = true;

  if (!Object.values(errors.value).some((field) => field.error)) {
    openSubmitLoading();

    try {
      await patchResetPassword(state);

      errorVisibility.value.email = false;
      errorVisibility.value.password = false;
      errorVisibility.value.repassword = false;

      await navigateTo({ name: 'index' });
    } catch (error) {
      if (error instanceof BadRequestError) {
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
      closeSubmitLoading();
    }
  }
}

async function onSubmit() {
  switch (page.value) {
    case 1:
      submitPage1();
      break;
    case 2:
      submitPage2();
      break;
    case 3:
      submitPage3();
      break;
    default:
      showError(createError({ status: 500 }));
      break;
  }
}

async function onResend() {
  if (!errors.value.email.error) {
    openSubmitLoading();

    await postResetPassword({ email: state.email })
      .catch(() => showError(createError({ status: 500 })))
      .finally(async () => {
        closeSubmitLoading();
      });
  }
  timer.restart();
}

function nextPage() {
  if (page.value <= 3 && page.value >= 0) page.value++;
}

function formatSeconds(seconds: number) {
  if (seconds >= 0 && seconds < 10) return `0${seconds}`;
  else return `${seconds}`;
}

onUnmounted(() => {
  clearInterval(progressInterval);
});
</script>

<template>
  <UContainer class="sm:py-0 md:mx-auto md:w-4/5" :class="[useStyles().pageContainer]">
    <div class="mb-6 flex-col gap-10 md:mb-9 lg:flex lg:self-center">
      <!-- Hero -->
      <section class="flex flex-col lg:mb-0">
        <h2
          class="font-ubuntu font-bold"
          :class="[useStyles().textColorPrimary, useStyles().textSize4XL]"
        >
          Restablecer contraseña
        </h2>
      </section>
    </div>

    <UBreadcrumb
      :links="breadcrumbItems"
      :ui="{ ol: 'gap-x-1.5 md:gap-x-4', li: 'gap-x-1.5 md:gap-x-4', base: 'gap-x-2' }"
      class="mb-6"
    >
      <template #icon="{ link, index, isActive }">
        <UAvatar
          :alt="(index + 1).toString()"
          :ui="{
            size: {
              xs: 'h-7 w-7 text-base md:text-lg',
            },
            background: isActive ? 'bg-primary-500 dark:bg-primary-400' : undefined,
            placeholder: isActive
              ? 'text-white dark:text-gray-900'
              : !!link.to
                ? 'group-hover:text-gray-700 dark:group-hover:text-gray-200'
                : '',
          }"
          size="xs"
          class="hidden min-[470px]:flex"
        />
      </template>

      <template #default="{ link, isActive }">
        <span
          class="w-min font-medium leading-none md:leading-none lg:text-nowrap"
          :class="[
            useStyles().textSizeBase,
            isActive
              ? 'font-semibold text-azure-500 dark:text-azure-400'
              : useStyles().textColorSecondary,
          ]"
        >
          {{ link.label }}
        </span>
      </template>
    </UBreadcrumb>

    <!-- Page Description -->
    <div class="flex flex-col" :class="[page === 2 ? 'mb-2' : 'mb-6']">
      <p>{{ paragraphsList[page - 1] }}</p>
    </div>

    <!-- Reset Timer -->
    <div v-if="page === 2" class="mb-2 flex h-16 items-center gap-x-4">
      <!-- Timer -->
      <div v-if="disableButton" class="relative size-[52px]">
        <svg class="size-[52px] -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <!-- Background Circle -->
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            class="stroke-current text-neutral-300 dark:text-neutral-700"
            stroke-width="3"
          ></circle>
          <!-- Progress Circle -->
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            class="stroke-current text-azure-500 dark:text-azure-400"
            stroke-width="3"
            stroke-dasharray="100"
            :stroke-dashoffset="progress"
            stroke-linecap="round"
          ></circle>
        </svg>

        <!-- Timer Text -->
        <div class="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <span
            class="text-center font-medium"
            :class="[useStyles().textColorPrimary, useStyles().textSizeBase]"
            >{{ timer.minutes.value }}:{{ formatSeconds(timer.seconds.value) }}</span
          >
        </div>
      </div>

      <!-- Button -->
      <button
        class="w-min font-semibold"
        :class="[useStyles().linkActiveState, useStyles().textSizeBase]"
        :disabled="disableButton"
        @click="onResend"
      >
        Reenviar
      </button>

      <!-- Help Button -->
      <div
        class="relative -top-px flex rounded-full border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-neutral-900"
        @click="isHelpOpen = true"
      >
        <UPopover
          v-model="isHelpOpen"
          overlay
          :popper="{ offsetDistance: 18, placement: 'top' }"
          class="flex"
        >
          <UIcon
            name="i-solar-question-circle-broken"
            class="h-5 w-5"
            :class="[useStyles().textColorPrimary]"
          />

          <template #panel>
            <div class="w-[80vw] max-w-[350px] p-1">
              <p class="p-1.5" :class="[useStyles().textSizeXS, useStyles().textColorSecondary]">
                Si no recibes el correo con el código y estás seguro de haber proporcionado la
                dirección correcta; revisa tu bandeja de spam, o ponte en contacto con
                <a href="mailto:sigmacuba2023@gmail.com"
                  ><span class="font-bold underline" :class="[useStyles().textColorPrimary]"
                    >nuestro soporte</span
                  ></a
                >.
              </p>
            </div>
          </template>
        </UPopover>
      </div>
    </div>

    <div class="flex max-w-sm flex-col">
      <UForm :state="state" class="w-full" @submit="onSubmit">
        <!-- Email -->
        <UFormGroup
          v-if="page === 1"
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

        <!-- Code -->
        <UFormGroup v-if="page === 2" size="md" label="Código" name="code" class="mb-4">
          <template #label="{ label, error }">
            <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
          </template>

          <template #default="{}">
            <InputPin v-model="pin" @submit="onSubmit" />
          </template>

          <template #error="{ error }">
            <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
              {{ error }}
            </span>
          </template>
        </UFormGroup>

        <!-- Password -->
        <UFormGroup
          v-if="page === 3"
          size="md"
          label="Nueva Contraseña"
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

        <!-- Repassword -->
        <UFormGroup
          v-if="page === 3"
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

        <div class="col-start-2 lg:mt-6">
          <div class="grid grid-cols-2 gap-x-4">
            <!-- Reset -->
            <UButton
              label="Cancelar"
              variant="solid"
              size="md"
              block
              :ui="useUIConfigs().cancelButtonConfig"
              class="font-bold"
              @click="$emit('cancel')"
            />

            <!-- Submit -->
            <UButton
              :label="submitButtonLabels[page - 1]"
              type="submit"
              variant="solid"
              size="md"
              block
              :ui="useUIConfigs().acceptButtonConfig"
              class="font-bold"
            />
          </div>
        </div>
      </UForm>
    </div>

    <!-- Reset Password Error -->
    <ModalMinimalError
      ref="resetPasswordErrorModal"
      title="Error de solicitud"
      body="El correo electrónico o el código que has ingresado son incorrectos. Verifica tus datos e inténtalo nuevamente."
    />

    <!-- Bad Request Error -->
    <ModalMinimalError
      ref="badRequestErrorModal"
      title="Error de solicitud"
      body="Estamos afrontando dificultades para procesar tu solicitud. Por favor, refresca esta página e inténtalo más tarde."
    />
  </UContainer>
</template>
