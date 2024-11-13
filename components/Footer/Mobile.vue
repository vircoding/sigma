<script setup lang="ts">
const linkTitleStyles = `font-semibold ${useStyles().textSizeLG} ${useStyles().textColorPrimary}`;
const brandIconStyles = 'h-7 w-7 md:h-[30px] md:w-[30px]';

const year = new Date().getFullYear();
</script>

<template>
  <div class="flex flex-col gap-5 py-6">
    <nav
      class="min-[325px]:px-[5%] min-[370px]:px-[10%] min-[450px]:px-[15%] min-[520px]:px-0 md:px-[5%]"
    >
      <!-- Links -->
      <ul
        class="grid grid-cols-2 grid-rows-2 items-start gap-y-4 min-[520px]:grid-cols-3 min-[520px]:grid-rows-1 min-[520px]:place-content-center"
      >
        <!-- Company -->
        <li class="col-start-1 row-start-1 justify-self-start min-[520px]:justify-self-center">
          <NuxtLink :to="{ name: 'about' }" class="flex items-center">
            <h4 :class="[linkTitleStyles]">Empresa</h4>
            <UIcon
              name="i-charm-chevron-down"
              class="relative top-px ml-0.5 md:top-0.5 md:ml-1"
              :class="useStyles().textColorPrimary"
            />
          </NuxtLink>
          <ul>
            <li :class="[useStyles().textSizeSM]">
              <NuxtLink :to="{ name: 'about' }">
                <span>¿Quiénes somos?</span>
              </NuxtLink>
            </li>

            <li :class="[useStyles().textSizeSM]">
              <NuxtLink :to="{ name: 'about' }">
                <span>Nuestro equipo</span>
              </NuxtLink>
            </li>
          </ul>
        </li>

        <!-- Contact us -->
        <li
          class="col-start-1 row-start-2 justify-self-start min-[520px]:col-start-2 min-[520px]:row-start-1 min-[520px]:justify-self-center"
        >
          <NuxtLink :to="{ name: 'support-contact' }" class="flex items-center justify-center">
            <h4 :class="[linkTitleStyles]">Contáctanos</h4>
            <UIcon
              name="i-charm-chevron-down"
              class="relative top-px ml-0.5 md:top-0.5 md:ml-1"
              :class="useStyles().textColorPrimary"
            />
          </NuxtLink>
          <ul>
            <li :class="[useStyles().textSizeSM]">
              <a href="https://wa.me/+5350009047">
                <span>Whatsapp</span>
              </a>
            </li>

            <li :class="[useStyles().textSizeSM]">
              <a href="mailto:sigmacuba2023@gmail.com">
                <span>Correo</span>
              </a>
            </li>
          </ul>
        </li>

        <!-- Socials -->
        <li
          class="col-start-2 row-span-2 row-start-1 self-center justify-self-end min-[520px]:col-start-3 min-[520px]:row-span-1 min-[520px]:justify-self-center"
        >
          <ul
            class="grid grid-cols-2 grid-rows-2 gap-4 min-[520px]:gap-2"
            :class="[useStyles().textColorPrimary]"
          >
            <!-- Instagram -->
            <li class="place-content-center p-1">
              <a href="https://www.instagram.com/sigmacuba" class="flex items-center">
                <UIcon name="i-fa6-brands-instagram" :class="[brandIconStyles]" />
              </a>
            </li>

            <!-- Youtube -->
            <li class="place-content-center p-1">
              <a href="https://www.youtube.com/@SigmaCasasCuba" class="flex items-center">
                <UIcon name="i-fa6-brands-youtube" :class="[brandIconStyles]" />
              </a>
            </li>

            <!-- Facebook -->
            <li class="place-content-center p-1">
              <a href="https://m.facebook.com/groups/249539844657857" class="flex items-center">
                <UIcon name="i-fa6-brands-facebook-f" class="h-[26px] w-[26px] md:h-7 md:w-7" />
              </a>
            </li>

            <!-- Twitter-X -->
            <li class="place-content-center p-1">
              <a href="https://twitter.com" class="flex items-center">
                <UIcon name="i-fa6-brands-x-twitter" :class="[brandIconStyles]" />
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <!-- Copyrights -->
    <div class="text-center">
      <span
        class="select-none font-semibold"
        :class="[useStyles().textColorPrimary, useStyles().textSizeSM]"
        >© {{ year }}, La Habana, Cuba</span
      >
    </div>
  </div>
</template>
