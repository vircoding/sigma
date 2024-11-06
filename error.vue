<script setup lang="ts">
const props = defineProps<{
  error: object;
}>();

const year = new Date().getFullYear();

const brandIconStyles = 'h-6 w-6 md:h-[26px] md:w-[26px]';

const getTitle = computed(() => {
  if ('statusCode' in props.error && props.error.statusCode) {
    let title;

    switch (props.error.statusCode) {
      case 404:
        if ('url' in props.error && (props.error.url as string).startsWith('/posts/')) {
          title = 'Anuncio no encontrado';
        } else title = 'Página no encontrada';
        break;
      default:
        title = '¡Vaya, ha ocurrido un error inesperado!';
        break;
    }

    return title;
  }

  return 'Error inesperado';
});

const getInfo = computed(() => {
  if ('statusCode' in props.error && props.error.statusCode) {
    let info;

    switch (props.error.statusCode) {
      case 404:
        if ('url' in props.error && (props.error.url as string).startsWith('/posts/')) {
          info =
            'El anuncio al que intentas acceder no existe. Es posible que el autor lo haya eliminado recientemente.';
        } else info = 'La página a la que intentas acceder no existe.';
        break;
      default:
        info =
          'Lamentablemente, ha ocurrido un problema en el servidor. Te sugerimos que intentes refrescar la página. Si el problema persiste, por favor, espera unos minutos e inténtalo más tarde.';
        break;
    }

    return info;
  }

  return 'Lamentablemente, ha ocurrido un problema en el servidor. Te sugerimos que intentes refrescar la página. Si el problema persiste, por favor, espera unos minutos e inténtalo más tarde';
});

function handleRefresh() {
  window.location.reload();
}
</script>

<template>
  <div
    class="text-center font-quicksand"
    :class="[useStyles().textColorSecondary, useStyles().textSizeBase]"
  >
    <!-- Wrapper -->
    <UContainer class="flex min-h-screen max-w-7xl flex-col">
      <!-- Content -->
      <div class="flex grow flex-col justify-center py-14">
        <UContainer :class="[useStyles().pageContainer]" class="flex flex-col items-center">
          <!-- Hero -->
          <div class="mb-10 flex items-center justify-center gap-5">
            <LogoError class="w-32" />
            <div>
              <h2
                class="relative top-0.5 font-ubuntu font-bold"
                :class="[useStyles().textColorPrimary, useStyles().textSize7XL]"
              >
                {{ 'statusCode' in props.error ? props.error.statusCode : '500' }}
              </h2>
            </div>
          </div>

          <div class="mb-6 flex flex-col items-center gap-2">
            <h1
              class="font-ubuntu font-bold"
              :class="[useStyles().textColorPrimary, useStyles().textSize3XL]"
            >
              {{ getTitle }}
            </h1>
            <p>{{ getInfo }}</p>
          </div>

          <!-- Home -->
          <UButton
            v-if="'statusCode' in props.error && props.error.statusCode === 404"
            :to="{ name: 'index' }"
            label="Página Principal"
            variant="solid"
            size="md"
            block
            :ui="useUIConfigs().acceptButtonConfig"
            class="w-min text-nowrap font-bold"
          />

          <!-- Refresh -->
          <UButton
            v-if="'statusCode' in props.error && props.error.statusCode === 500"
            label="Refrescar"
            variant="solid"
            size="md"
            block
            :ui="useUIConfigs().acceptButtonConfig"
            class="w-min text-nowrap font-bold"
            @click="handleRefresh"
          />
        </UContainer>
      </div>

      <!-- Footer -->
      <footer class="flex flex-col items-center gap-4 pb-6">
        <div class="flex flex-wrap items-center gap-4 md:gap-6">
          <!-- Logo -->
          <LogoHorizontal class="w-[136px]" :class="[useStyles().textColorPrimary]" />

          <!-- Socials -->
          <nav class="flex items-center justify-self-center">
            <ul class="flex items-center gap-1" :class="[useStyles().textColorPrimary]">
              <!-- Instagram -->
              <li class="p-1">
                <a href="https://www.instagram.com/sigmacuba" class="flex items-center">
                  <UIcon name="i-fa6-brands-instagram" :class="[brandIconStyles]" />
                </a>
              </li>

              <!-- Facebook -->
              <li class="p-1">
                <a href="https://m.facebook.com/groups/249539844657857" class="flex items-center">
                  <UIcon name="i-fa6-brands-facebook-f" class="h-5 w-5 md:h-[22px] md:w-[22px]" />
                </a>
              </li>

              <!-- Youtube -->
              <li class="p-1">
                <a href="https://www.youtube.com/@SigmaCasasCuba" class="flex items-center">
                  <UIcon name="i-fa6-brands-youtube" :class="[brandIconStyles]" />
                </a>
              </li>

              <!-- Twitter-X -->
              <li class="p-1">
                <a href="https://twitter.com" class="flex items-center">
                  <UIcon name="i-fa6-brands-x-twitter" :class="[brandIconStyles]" />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Copyrights -->
        <div class="">
          <span
            class="select-none font-semibold"
            :class="[useStyles().textColorPrimary, useStyles().textSizeSM]"
            >© {{ year }}, La Habana, Cuba</span
          >
        </div>
      </footer>
    </UContainer>
  </div>
</template>
