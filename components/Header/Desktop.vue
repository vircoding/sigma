<script setup lang="ts">
const findLinks = [
  [
    {
      label: 'Ventas',
    },
    {
      label: 'Rentas',
    },
    {
      label: 'Permutas',
    },
  ],
];

const linkIconStyles =
  'ml-1 md:ml-2 h-[22px] w-[22px] text-azure-950 md:h-[26px] md:w-[26px] dark:text-gray-200';
</script>

<template>
  <div
    class="flex flex-col items-center justify-between gap-4 py-4 sm:py-5 md:py-6 lg:flex-row lg:gap-0"
  >
    <!-- Logo -->
    <LogoHorizontal class="h-10 sm:h-11 md:h-12" />

    <nav>
      <ul class="flex space-x-4 sm:space-x-5 lg:space-x-6">
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
              <h4 class="text-lg font-semibold md:text-xl">Descubre</h4>
              <UIcon name="i-solar-filter-broken" :class="linkIconStyles" />
            </button>

            <template #item="{ item }">
              <span
                class="w-full truncate pl-4 pr-1 text-right text-sm text-gray-500 md:text-base dark:text-gray-300"
                >{{ item.label }}</span
              >
            </template>
          </UDropdown>
        </li>

        <!-- Help -->
        <li>
          <div class="flex items-center justify-end">
            <h4 class="text-lg font-semibold md:text-xl">Ayuda</h4>
            <UIcon name="i-solar-question-square-broken" :class="linkIconStyles" />
          </div>
        </li>

        <!-- Signup -->
        <li>
          <div class="flex items-center justify-end">
            <h4 class="text-lg font-semibold md:text-xl">Registrarse</h4>
            <UIcon name="i-solar-cursor-square-broken" :class="linkIconStyles" />
          </div>
        </li>

        <!-- Login -->
        <li>
          <div class="flex items-center justify-end">
            <h4 class="text-lg font-semibold md:text-xl">Iniciar Sesión</h4>
            <UIcon name="i-solar-key-square-2-linear" :class="linkIconStyles" />
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>
