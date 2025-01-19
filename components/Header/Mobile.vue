<script setup lang="ts">
import type { PostType } from '~/models/PostTypes';

const props = defineProps<{
  isLoggedIn: boolean;
}>();

const { $event } = useNuxtApp();
const { setInsertType } = useGlobalStore();

const { logout } = useAuth();
const { openSubmitLoading, closeSubmitLoading } = useGlobal();

const isSlideoverOpen = ref(false);
const isAccountModalOpen = ref(false);

const slideoverConfig = {
  width: 'w-max min-w-[55%] max-w-max sm:min-w-[45%] md:min-w-[40%]',
};

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const linkIconStyles = `relative top-px h-[22px] w-[22px] md:h-[26px] md:w-[26px] ${useStyles().textColorPrimary}`;
const linkTitleStyles = `font-semibold ${useStyles().textSizeLG} ${useStyles().textColorPrimary}`;

function openAccountModal() {
  isSlideoverOpen.value = false;
  isAccountModalOpen.value = true;
}

async function handleLogout() {
  isAccountModalOpen.value = false;
  openSubmitLoading();

  await logout().catch(async () => {
    closeSubmitLoading();
    throw showError(createError({ status: 500 }));
  });

  await navigateTo({ name: 'index' });

  closeSubmitLoading();
}

function onNavigateToInsert(type: PostType) {
  setInsertType(type);
  $event('navigation:insert', type);
  isSlideoverOpen.value = false;
}
</script>

<template>
  <div class="flex items-center justify-between py-4 sm:py-5 md:py-6">
    <!-- Logo -->
    <NuxtLink :to="{ name: 'index' }">
      <LogoHorizontal class="h-10 sm:h-11 md:h-12" :class="[useStyles().textColorPrimary]" />
    </NuxtLink>

    <!-- Slideover Navbar -->
    <div class="flex items-center">
      <!-- Open Slideover Button -->
      <ButtonIcon @click="isSlideoverOpen = true">
        <UIcon
          name="i-solar-hamburger-menu-outline"
          class="h-6 w-6 min-[354px]:h-7 min-[354px]:w-7 sm:h-9 sm:w-9 md:h-10 md:w-10"
          :class="[useStyles().textColorPrimary]"
        />
      </ButtonIcon>

      <USlideover
        v-model="isSlideoverOpen"
        :ui="slideoverConfig"
        :class="useStyles().textColorSecondary"
      >
        <!-- Wrapper -->
        <UContainer class="flex w-full flex-col items-end">
          <!-- Close Slideover Button -->
          <div class="flex items-center py-[22px] sm:py-6 md:py-7">
            <ButtonIcon @click="isSlideoverOpen = false">
              <UIcon
                name="i-charm-cross"
                class="h-6 w-6 min-[354px]:h-7 min-[354px]:w-7 sm:h-9 sm:w-9 md:h-10 md:w-10"
                :class="[useStyles().textColorPrimary]"
              />
            </ButtonIcon>
          </div>

          <!-- Divider -->
          <UDivider type="dashed" />

          <!-- Navbar -->
          <nav class="px-2 py-7 text-right sm:px-3 sm:py-8 md:px-4 md:py-8">
            <ul class="space-y-2">
              <!-- Help -->
              <li class="py-1">
                <NuxtLink
                  :to="{ name: 'support' }"
                  class="flex w-full items-center justify-end gap-1.5 py-1"
                  @click="isSlideoverOpen = false"
                >
                  <h4 :class="linkTitleStyles">Ayuda</h4>
                  <UIcon name="i-solar-question-square-broken" :class="linkIconStyles" />
                </NuxtLink>
                <ul class="leading-snug">
                  <li>
                    <NuxtLink :to="{ name: 'support' }" @click="isSlideoverOpen = false">
                      <span :class="[useStyles().textSizeBase]">¿Cómo funciona el sitio?</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink :to="{ name: 'support' }" @click="isSlideoverOpen = false">
                      <span :class="[useStyles().textSizeBase]">Preguntas frecuentes</span>
                    </NuxtLink>
                  </li>
                </ul>
              </li>

              <!-- Insert -->
              <li v-if="props.isLoggedIn" class="py-1">
                <NuxtLink
                  :to="{ name: 'insert' }"
                  class="flex w-full items-center justify-end gap-1.5 py-1"
                  @click="onNavigateToInsert('sale')"
                >
                  <h4 :class="linkTitleStyles">Publica</h4>
                  <UIcon name="i-solar-home-add-angle-broken" :class="linkIconStyles" />
                </NuxtLink>
                <ul class="leading-snug">
                  <li>
                    <NuxtLink :to="{ name: 'insert' }" @click="onNavigateToInsert('sale')">
                      <span :class="[useStyles().textSizeBase]">Vende</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink :to="{ name: 'insert' }" @click="onNavigateToInsert('rent')">
                      <span :class="[useStyles().textSizeBase]">Renta</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink :to="{ name: 'insert' }" @click="onNavigateToInsert('exchange')">
                      <span :class="[useStyles().textSizeBase]">Permuta</span>
                    </NuxtLink>
                  </li>
                </ul>
              </li>

              <!-- Find -->
              <li class="py-1">
                <NuxtLink
                  :to="{ name: 'posts' }"
                  class="flex w-full items-center justify-end gap-1.5 py-1"
                  @click="isSlideoverOpen = false"
                >
                  <h4 :class="linkTitleStyles">Descubre</h4>
                  <UIcon name="i-solar-filter-broken" :class="linkIconStyles" />
                </NuxtLink>
                <ul class="leading-snug">
                  <li>
                    <NuxtLink :to="{ name: 'posts' }" @click="isSlideoverOpen = false">
                      <span :class="[useStyles().textSizeBase]">Ventas</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink :to="{ name: 'posts' }" @click="isSlideoverOpen = false">
                      <span :class="[useStyles().textSizeBase]">Rentas</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink :to="{ name: 'posts' }" @click="isSlideoverOpen = false">
                      <span :class="[useStyles().textSizeBase]">Permutas</span>
                    </NuxtLink>
                  </li>
                </ul>
              </li>

              <!-- Signup -->
              <li v-if="!props.isLoggedIn" class="py-1">
                <NuxtLink
                  :to="{ name: 'auth-register' }"
                  class="flex w-full items-center justify-end gap-1.5 py-1"
                  @click="isSlideoverOpen = false"
                >
                  <h4 :class="linkTitleStyles">Registrarse</h4>
                  <UIcon name="i-solar-cursor-square-broken" :class="linkIconStyles" />
                </NuxtLink>
              </li>

              <!-- Login -->
              <li v-if="!props.isLoggedIn" class="py-1">
                <NuxtLink
                  :to="{ name: 'auth-login' }"
                  class="flex w-full items-center justify-end gap-1.5 py-1"
                  @click="isSlideoverOpen = false"
                >
                  <h4 :class="linkTitleStyles">Iniciar Sesión</h4>
                  <UIcon name="i-solar-key-square-2-linear" :class="linkIconStyles" />
                </NuxtLink>
              </li>

              <!-- Account -->
              <li v-if="props.isLoggedIn" class="py-1">
                <button
                  :to="{ name: 'index' }"
                  class="flex w-full items-center justify-end gap-1.5 py-1"
                  @click="openAccountModal"
                >
                  <h4 :class="linkTitleStyles">Cuenta</h4>
                  <UIcon name="i-solar-user-circle-broken" :class="linkIconStyles" />
                </button>
              </li>
            </ul>
          </nav>
        </UContainer>
      </USlideover>
    </div>

    <UModal
      v-model="isAccountModalOpen"
      :ui="{
        width: 'w-full max-w-96 sm:max-w-96',
        container: 'sm:items-end',
        background: 'bg-gray-200/30 dark:bg-gray-500/30',
      }"
    >
      <div
        class="flex flex-col items-center justify-center gap-y-2 overflow-hidden rounded-xl p-2 backdrop-blur-sm"
      >
        <!-- Top -->
        <NuxtLink
          v-if="user?.type === 'agent'"
          :to="{ name: 'update-agent' }"
          class="flex w-full items-center justify-between gap-x-5 rounded-lg bg-gray-100 px-[8%] py-1 text-base min-[354px]:text-lg dark:bg-gray-800"
          @click="isAccountModalOpen = false"
        >
          <div class="flex grow flex-col overflow-hidden">
            <span class="truncate font-semibold" :class="[useStyles().textColorPrimary]">{{
              user.firstname
            }}</span>
            <div class="flex w-min items-center gap-x-1">
              <UIcon
                name="i-solar-pen-new-square-linear"
                class="h-4 w-4"
                :class="[useStyles().textColorSecondary]"
              />
              <span
                class="text-xs font-medium min-[354px]:text-sm"
                :class="[useStyles().textColorSecondary]"
                >Editar</span
              >
            </div>
          </div>

          <UAvatar :src="user.avatar" :alt="user.firstname" size="md" />
        </NuxtLink>

        <!-- Bottom -->
        <ul
          class="flex w-full flex-col gap-y-2 text-sm min-[354px]:text-base"
          :class="[useStyles().textColorSecondary]"
        >
          <div class="flex items-center gap-x-2">
            <!-- Client Post -->
            <li
              v-if="user?.type === 'client'"
              class="flex w-[40%] items-center gap-x-1.5 rounded-lg bg-gray-100 px-2 py-1 dark:bg-gray-800"
            >
              <UIcon
                name="i-solar-home-smile-angle-broken"
                class="h-6 w-6 min-[354px]:h-7 min-[354px]:w-7"
                :class="[useStyles().textColorSecondary]"
              />
              <span class="w-full truncate font-semibold">Tu Casa</span>
            </li>

            <!-- Agent Posts -->
            <li
              v-else-if="user?.type === 'agent'"
              class="flex w-[40%] items-center gap-x-1.5 rounded-lg bg-gray-100 px-2 py-1 dark:bg-gray-800"
            >
              <UIcon
                name="i-solar-home-smile-angle-broken"
                class="h-6 w-6 min-[354px]:h-7 min-[354px]:w-7"
                :class="[useStyles().textColorSecondary]"
              />
              <span class="w-full truncate font-semibold">Tus Casas</span>
            </li>

            <!-- Become an Agent -->
            <li
              v-if="user?.type === 'client'"
              class="flex w-[60%] items-center gap-x-1 rounded-lg bg-gray-100 px-2 py-1 dark:bg-gray-800"
            >
              <UIcon
                name="i-solar-user-plus-broken"
                class="h-6 w-6 min-[354px]:h-7 min-[354px]:w-7"
                :class="[useStyles().textColorSecondary]"
              />
              <span class="w-full truncate font-semibold">¿Eres Agente?</span>
            </li>

            <!-- Become a Client -->
            <li
              v-else-if="user?.type === 'agent'"
              class="flex w-[60%] items-center gap-x-1 rounded-lg bg-gray-100 px-2 py-1 dark:bg-gray-800"
            >
              <UIcon
                name="i-solar-user-minus-broken"
                class="h-6 w-6 min-[354px]:h-7 min-[354px]:w-7"
                :class="[useStyles().textColorSecondary]"
              />
              <span class="w-full truncate font-semibold">¿No eres Agente?</span>
            </li>
          </div>

          <div class="flex items-center gap-x-2">
            <!-- Favorites -->
            <li
              class="flex w-[40%] items-center gap-x-1.5 rounded-lg bg-gray-100 px-2 py-1 dark:bg-gray-800"
            >
              <UIcon
                name="i-solar-star-broken"
                class="h-6 w-6 min-[354px]:h-7 min-[354px]:w-7"
                :class="[useStyles().textColorSecondary]"
              />
              <span class="w-full truncate font-semibold">Favoritos</span>
            </li>

            <!-- Logout -->
            <li class="w-[60%] rounded-lg bg-gray-100 px-2 py-1 dark:bg-gray-800">
              <button class="flex w-full items-center gap-x-1.5" @click="handleLogout">
                <UIcon
                  name="i-solar-exit-broken"
                  class="h-6 w-6 min-[354px]:h-7 min-[354px]:w-7"
                  :class="[useStyles().textColorSecondary]"
                />
                <span class="w-full truncate text-left font-semibold">Cerrar Sesión</span>
              </button>
            </li>
          </div>
        </ul>
      </div>
    </UModal>
  </div>
</template>
