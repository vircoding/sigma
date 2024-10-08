<script setup lang="ts">
const slideoverOpen = ref(false);

const slideoverConfig = {
  width: 'w-max min-w-[55%] max-w-max sm:min-w-[45%] md:min-w-[40%]',
};

const linkIconStyles =
  'relative top-px h-[22px] w-[22px] text-azure-950 md:h-[26px] md:w-[26px] dark:text-gray-200';
</script>

<template>
  <div class="flex items-center justify-between py-4 sm:py-5 md:py-6">
    <!-- Logo -->
    <LogoHorizontal class="h-10 sm:h-11 md:h-12" />

    <!-- Slideover Navbar -->
    <div class="flex items-center">
      <!-- Open Slideover Button -->
      <ButtonIcon @click="slideoverOpen = true">
        <UIcon
          name="i-charm-menu-hamburger"
          class="h-8 w-8 text-azure-950 sm:h-9 sm:w-9 md:h-10 md:w-10 dark:text-gray-200"
        />
      </ButtonIcon>

      <USlideover
        v-model="slideoverOpen"
        :ui="slideoverConfig"
        class="text-azure-950 dark:text-gray-200"
      >
        <!-- Wrapper -->
        <UContainer class="flex w-full flex-col items-end">
          <div class="flex items-center py-5 sm:py-6 md:py-7">
            <!-- Close Slideover Button -->
            <ButtonIcon @click="slideoverOpen = false">
              <UIcon
                name="i-charm-cross"
                class="h-8 w-8 text-azure-950 sm:h-9 sm:w-9 md:h-10 md:w-10 dark:text-gray-200"
              />
            </ButtonIcon>
          </div>

          <!-- Divider -->
          <UDivider type="dotted" />

          <!-- Navbar -->
          <nav class="px-2 py-7 text-right sm:px-3 sm:py-8 md:px-4 md:py-8">
            <ul class="space-y-2">
              <!-- Find -->
              <li class="py-1">
                <div class="flex items-center justify-end gap-1.5 py-1">
                  <h4 class="text-lg font-semibold md:text-xl">Ayuda</h4>
                  <UIcon name="i-solar-question-square-broken" :class="linkIconStyles" />
                </div>
                <ul class="leading-snug">
                  <li>
                    <span class="md:text-lg">¿Cómo funciona el sitio?</span>
                  </li>
                  <li>
                    <span class="md:text-lg">Preguntas frecuentes</span>
                  </li>
                </ul>
              </li>

              <!-- Help -->
              <li class="py-1">
                <div class="flex items-center justify-end gap-1.5 py-1">
                  <h4 class="text-lg font-semibold md:text-xl">Descubre</h4>
                  <UIcon name="i-solar-filter-broken" :class="linkIconStyles" />
                </div>
                <ul class="leading-snug">
                  <li>
                    <span class="md:text-lg">Ventas</span>
                  </li>
                  <li>
                    <span class="md:text-lg">Rentas</span>
                  </li>
                  <li>
                    <span class="md:text-lg">Permutas</span>
                  </li>
                </ul>
              </li>

              <!-- Signup -->
              <li class="py-1">
                <div class="flex items-center justify-end gap-1.5 py-1">
                  <h4 class="text-lg font-semibold md:text-xl">Registrarse</h4>
                  <UIcon name="i-solar-cursor-square-broken" :class="linkIconStyles" />
                </div>
              </li>

              <!-- Login -->
              <li class="py-1">
                <div class="flex items-center justify-end gap-1.5 py-1">
                  <h4 class="text-lg font-semibold md:text-xl">Iniciar Sesión</h4>
                  <UIcon name="i-solar-key-square-2-linear" :class="linkIconStyles" />
                </div>
              </li>
            </ul>
          </nav>
        </UContainer>
      </USlideover>
    </div>
  </div>
</template>
