<script setup lang="ts">
const findLinks = [[{ label: 'Ventas' }, { label: 'Rentas' }, { label: 'Permutas' }]];

const helpLinks = [[{ label: '¿Cómo funciona el sitio?' }, { label: 'Preguntas frecuentes' }]];

const linkIconStyles = `ml-1 md:ml-2 h-[22px] w-[22px] md:h-[26px] md:w-[26px] ${useStyles().textColorPrimary}`;
const linkTitleStyles = `font-semibold ${useStyles().textSizeLG}`;
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
              <span
                class="w-full truncate pl-4 pr-1 text-right"
                :class="[useStyles().textColorSecondary, useStyles().textSizeSM]"
                >{{ item.label }}</span
              >
            </template>
          </UDropdown>
        </li>

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
              <span
                class="w-full truncate px-1 text-right"
                :class="[useStyles().textColorSecondary, useStyles().textSizeSM]"
                >{{ item.label }}</span
              >
            </template>
          </UDropdown>
        </li>

        <!-- Signup -->
        <li>
          <NuxtLink :to="{ name: 'auth-register' }" class="flex items-center justify-end">
            <h4 :class="[linkTitleStyles]">Registrarse</h4>
            <UIcon name="i-solar-cursor-square-broken" :class="linkIconStyles" />
          </NuxtLink>
        </li>

        <!-- Login -->
        <li>
          <div class="flex items-center justify-end">
            <h4 :class="[linkTitleStyles]">Iniciar Sesión</h4>
            <UIcon name="i-solar-key-square-2-linear" :class="linkIconStyles" />
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>
