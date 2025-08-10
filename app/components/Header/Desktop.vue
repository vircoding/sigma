<script setup lang="ts">
import { ModalUserPosts } from '#components';

const props = defineProps<{
  isLoggedIn: boolean;
}>();

const modals = useModal();

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const { setInsertPagePostType, setSearchPagePostType } = useUIStore();

const { $event } = useNuxtApp();
const { setSubmitLoading } = useUIConfig();

const { logout } = useAuth();

const insertLinks = [
  [
    {
      label: 'Vende',
      to: { name: 'insert' },
      border: 'group-hover/item:border-azure-500 group-hover/item:dark:border-azure-400',
      click: () => {
        setInsertPagePostType('sale');
      },
    },
    {
      label: 'Renta',
      to: { name: 'insert' },
      border: 'group-hover/item:border-keppel-500 group-hover/item:dark:border-keppel-400',
      click: () => {
        setInsertPagePostType('rent');
      },
    },
    {
      label: 'Permuta',
      to: { name: 'insert' },
      border: 'group-hover/item:border-affair-500 group-hover/item:dark:border-affair-400',
      click: () => {
        setInsertPagePostType('exchange');
      },
    },
  ],
];

const findLinks = [
  [
    {
      label: 'Ventas',
      to: { name: 'posts' },
      border: 'group-hover/item:border-azure-500 group-hover/item:dark:border-azure-400',
      click: () => {
        setSearchPagePostType('sale');
      },
    },
    {
      label: 'Rentas',
      to: { name: 'posts' },
      border: 'group-hover/item:border-keppel-500 group-hover/item:dark:border-keppel-400',
      click: () => {
        setSearchPagePostType('rent');
      },
    },
    {
      label: 'Permutas',
      to: { name: 'posts' },
      border: 'group-hover/item:border-affair-500 group-hover/item:dark:border-affair-400',
      click: () => {
        setSearchPagePostType('exchange');
      },
    },
  ],
];

const helpLinks = [
  [
    {
      label: '¿Cómo funciona el sitio?',
      to: { name: 'support' },
      border: 'group-hover/item:border-gray-500 group-hover/item:dark:border-gray-300',
    },
    {
      label: 'Preguntas frecuentes',
      to: { name: 'support' },
      border: 'group-hover/item:border-gray-500 group-hover/item:dark:border-gray-300',
    },
  ],
];

const clientAccountItems = [
  [
    {
      label: 'Tu Casa',
      icon: 'i-solar-home-smile-angle-broken',
      click: () => {
        modals.open(ModalUserPosts);
      },
    },
    {
      label: 'Favoritos',
      icon: 'i-solar-star-broken',
    },
  ],
  [
    {
      label: '¿Eres Agente?',
      icon: 'i-solar-user-plus-broken',
    },
    {
      label: 'Cerrar Sesión',
      icon: 'i-solar-exit-broken',
      click: handleLogout,
    },
  ],
];

const getAccountLink = computed(() => {
  if (props.isLoggedIn && user.value) {
    if (user.value.type === 'client') return clientAccountItems;
    else if (user.value.type === 'agent')
      return [
        [
          {
            label: user.value.firstname,
            avatar: {
              src: user.value.avatar,
            },
            to: { name: 'update-agent' },
          },
        ],
        [
          {
            label: 'Tus Anuncios',
            icon: 'i-solar-home-smile-angle-broken',
            click: () => {
              modals.open(ModalUserPosts);
            },
          },
          {
            label: 'Favoritos',
            icon: 'i-solar-star-broken',
          },
        ],
        [
          {
            label: '¿No eres Agente?',
            icon: 'i-solar-user-minus-broken',
          },
          {
            label: 'Cerrar Sesión',
            icon: 'i-solar-exit-broken',
            click: handleLogout,
          },
        ],
      ];
  }

  return [
    [
      {
        label: 'Cerrar Sesión',
        icon: 'i-solar-exit-broken',
        click: handleLogout,
      },
    ],
  ];
});

const linkIconStyles = `ml-1 md:ml-2 h-[22px] w-[22px] md:h-[26px] md:w-[26px] ${useStyles().textColorPrimary}`;
const linkTitleStyles = `font-semibold ${useStyles().textSizeLG}`;

async function handleLogout() {
  setSubmitLoading();

  await logout().catch(async () => {
    setSubmitLoading(false);
    throw showError(createError({ status: 500 }));
  });

  await navigateTo({ name: 'index' });

  setSubmitLoading(false);
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-between gap-4 py-4 sm:py-5 md:py-6 lg:flex-row lg:gap-0"
  >
    <!-- Logo -->
    <NuxtLink :to="{ name: 'index' }">
      <LogoHorizontal class="h-10 sm:h-11 md:h-12" :class="[useStyles().textColorPrimary]" />
    </NuxtLink>

    <nav>
      <ul class="flex space-x-4 sm:space-x-5 lg:space-x-6" :class="[useStyles().textColorPrimary]">
        <!-- Help -->
        <li>
          <UDropdown
            :items="helpLinks"
            mode="click"
            :popper="{ offsetDistance: 15, placement: 'bottom-end' }"
            :ui="{ width: 'w-min' }"
          >
            <button class="flex items-center justify-end">
              <UIcon name="i-charm-chevron-down" class="mr-0.5 md:mr-1" />
              <h4 :class="[linkTitleStyles]">Ayuda</h4>
              <UIcon name="i-solar-question-square-broken" :class="linkIconStyles" />
            </button>

            <template #item="{ item }">
              <div
                class="group/item w-full border-r-[3px] border-gray-200 pl-4 text-right dark:border-gray-600"
                :class="[item.border]"
              >
                <span
                  class="w-full truncate pr-2 text-right"
                  :class="[useStyles().textColorSecondary, useStyles().textSizeSM, item.border]"
                  >{{ item.label }}</span
                >
              </div>
            </template>
          </UDropdown>
        </li>

        <!-- Insert -->
        <li v-if="props.isLoggedIn">
          <UDropdown
            :items="insertLinks"
            mode="click"
            :popper="{ offsetDistance: 15, placement: 'bottom-end' }"
            :ui="{ width: 'w-min' }"
          >
            <button class="flex items-center justify-end">
              <UIcon name="i-charm-chevron-down" class="mr-0.5 md:mr-1" />
              <h4 :class="[linkTitleStyles]">Publica</h4>
              <UIcon name="i-solar-home-add-angle-broken" :class="linkIconStyles" />
            </button>

            <template #item="{ item }">
              <div
                class="group/item w-full border-r-[3px] border-gray-200 pl-4 text-right dark:border-gray-600"
                :class="[item.border]"
              >
                <span
                  class="w-full truncate pr-2 text-right"
                  :class="[useStyles().textColorSecondary, useStyles().textSizeSM, item.border]"
                  >{{ item.label }}</span
                >
              </div>
            </template>
          </UDropdown>
        </li>

        <!-- Find -->
        <li>
          <UDropdown
            :items="findLinks"
            mode="click"
            :popper="{ offsetDistance: 15, placement: 'bottom-end' }"
            :ui="{ width: 'w-min' }"
          >
            <button class="flex items-center justify-end">
              <UIcon name="i-charm-chevron-down" class="mr-0.5 md:mr-1" />
              <h4 :class="[linkTitleStyles]">Descubre</h4>
              <UIcon name="i-solar-filter-broken" :class="linkIconStyles" />
            </button>

            <template #item="{ item }">
              <div
                class="group/item w-full border-r-[3px] border-gray-200 pl-4 text-right dark:border-gray-600"
                :class="[item.border]"
              >
                <span
                  class="w-full truncate pr-2 text-right"
                  :class="[useStyles().textColorSecondary, useStyles().textSizeSM, item.border]"
                  >{{ item.label }}</span
                >
              </div>
            </template>
          </UDropdown>
        </li>

        <!-- Signup -->
        <li v-if="!props.isLoggedIn">
          <NuxtLink :to="{ name: 'auth-register' }" class="flex items-center justify-end">
            <h4 :class="[linkTitleStyles]">Registrarse</h4>
            <UIcon name="i-solar-cursor-square-broken" :class="linkIconStyles" />
          </NuxtLink>
        </li>

        <!-- Login -->
        <li v-if="!props.isLoggedIn">
          <NuxtLink :to="{ name: 'auth-login' }" class="flex items-center justify-end">
            <h4 :class="[linkTitleStyles]">Iniciar Sesión</h4>
            <UIcon name="i-solar-key-square-2-linear" :class="linkIconStyles" />
          </NuxtLink>
        </li>

        <!-- Account -->
        <li v-if="props.isLoggedIn">
          <UDropdown
            :items="getAccountLink"
            :popper="{ offsetDistance: 15, placement: 'bottom-end' }"
            :ui="{ width: 'w-min' }"
          >
            <button class="flex items-center justify-end">
              <UIcon name="i-charm-chevron-down" class="mr-0.5 md:mr-1" />
              <h4 :class="[linkTitleStyles]">Cuenta</h4>
              <UIcon name="i-solar-user-circle-broken" :class="linkIconStyles" />
            </button>

            <template #item="{ item }">
              <div
                class="group/item flex w-full flex-row-reverse items-center justify-between gap-x-3 px-1"
                :class="[user?.type === 'agent' && !item.avatar ? 'pr-[11px]' : undefined]"
              >
                <UAvatar v-if="item.avatar" :src="item.avatar.src" :alt="item.label" size="md" />

                <UIcon
                  v-if="!item.avatar"
                  :name="item.icon"
                  class="h-6 w-6 text-gray-500 group-hover/item:text-azure-950 dark:text-gray-400 group-hover/item:dark:text-gray-200"
                  :class="[
                    item.icon === 'i-solar-user-plus-broken' ||
                    item.icon === 'i-solar-user-minus-broken'
                      ? 'relative left-0.5'
                      : '',
                  ]"
                />

                <div class="flex flex-col items-start">
                  <span
                    class="w-full truncate text-left group-hover/item:text-azure-950 group-hover/item:dark:text-gray-200"
                    :class="[
                      item.avatar
                        ? `${useStyles().textColorPrimary} ${useStyles().textSizeBase} font-semibold`
                        : `${useStyles().textColorSecondary} ${useStyles().textSizeSM}`,
                    ]"
                    >{{ item.label }}</span
                  >
                  <div v-if="item.avatar" class="flex items-center gap-x-1">
                    <UIcon
                      name="i-solar-pen-new-square-linear"
                      class="h-[13px] w-[13px] group-hover/item:text-azure-950 group-hover/item:dark:text-gray-200"
                      :class="useStyles().textColorSecondary"
                    />
                    <span
                      class="font-medium group-hover/item:text-azure-950 group-hover/item:dark:text-gray-200"
                      :class="[useStyles().textSizeXS, useStyles().textColorSecondary]"
                      >Editar</span
                    >
                  </div>
                </div>
              </div>
            </template>
          </UDropdown>
        </li>
      </ul>
    </nav>
  </div>
</template>
