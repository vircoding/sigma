<script setup lang="ts">
const isSlideoverOpen = ref(false);

const slideoverConfig = {
  width: 'w-max min-w-[55%] max-w-max sm:min-w-[45%] md:min-w-[40%]',
};

const linkIconStyles = `relative top-px h-[22px] w-[22px] md:h-[26px] md:w-[26px] ${useStyles().textColorPrimary}`;
const linkTitleStyles = `font-semibold ${useStyles().textSizeLG} ${useStyles().textColorPrimary}`;
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
          name="i-charm-menu-hamburger"
          class="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
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
          <div class="flex items-center py-5 sm:py-6 md:py-7">
            <ButtonIcon @click="isSlideoverOpen = false">
              <UIcon
                name="i-charm-cross"
                class="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
                :class="[useStyles().textColorPrimary]"
              />
            </ButtonIcon>
          </div>

          <!-- Divider -->
          <UDivider type="dashed" />

          <!-- Navbar -->
          <nav class="px-2 py-7 text-right sm:px-3 sm:py-8 md:px-4 md:py-8">
            <ul class="space-y-2">
              <!-- Find -->
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

              <!-- Help -->
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
              <li class="py-1">
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
              <li class="py-1">
                <NuxtLink
                  :to="{ name: 'auth-login' }"
                  class="flex w-full items-center justify-end gap-1.5 py-1"
                  @click="isSlideoverOpen = false"
                >
                  <h4 :class="linkTitleStyles">Iniciar Sesión</h4>
                  <UIcon name="i-solar-key-square-2-linear" :class="linkIconStyles" />
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </UContainer>
      </USlideover>
    </div>
  </div>
</template>
