<script setup lang="ts">
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
          <span class="flex items-center">
            <h4 class="text-lg font-semibold md:text-xl">Empresa</h4>
            <UIcon name="i-charm-chevron-down" class="relative top-px ml-0.5 md:top-0.5 md:ml-1" />
          </span>
          <ul>
            <li class="text-sm md:text-base">¿Quiénes somos?</li>

            <li class="text-sm md:text-base">Nuestro equipo</li>
          </ul>
        </li>

        <!-- Contact us -->
        <li
          class="col-start-1 row-start-2 justify-self-start min-[520px]:col-start-2 min-[520px]:row-start-1 min-[520px]:justify-self-center"
        >
          <span class="flex items-center justify-center">
            <h4 class="text-lg font-semibold md:text-xl">Contáctanos</h4>
            <UIcon name="i-charm-chevron-down" class=":top-px relative ml-0.5 md:top-0.5 md:ml-1" />
          </span>
          <ul>
            <li class="text-sm md:text-base">Whatsapp</li>

            <li class="text-sm md:text-base">Email</li>
          </ul>
        </li>

        <!-- Socials -->
        <li
          class="col-start-2 row-span-2 row-start-1 self-center justify-self-end min-[520px]:col-start-3 min-[520px]:row-span-1 min-[520px]:justify-self-center"
        >
          <ul class="grid grid-cols-2 grid-rows-2 gap-4 min-[520px]:gap-2">
            <!-- Instagram -->
            <li class="place-content-center p-1">
              <a href="https://www.instagram.com/sigmacuba" class="flex items-center">
                <UIcon name="i-fa6-brands-instagram" class="h-7 w-7 md:h-[30px] md:w-[30px]" />
              </a>
            </li>

            <!-- Youtube -->
            <li class="place-content-center p-1">
              <a href="https://www.youtube.com/@SigmaCasasCuba" class="flex items-center">
                <UIcon name="i-fa6-brands-youtube" class="h-7 w-7 md:h-[30px] md:w-[30px]" />
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
                <UIcon name="i-fa6-brands-x-twitter" class="h-7 w-7 md:h-[30px] md:w-[30px]" />
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <!-- Copyrights -->
    <div class="text-center">
      <span class="select-none text-sm font-semibold md:text-base"
        >© {{ year }}, La Habana, Cuba</span
      >
    </div>
  </div>
</template>
