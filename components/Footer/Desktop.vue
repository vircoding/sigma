<script setup lang="ts">
const companyLinks = [
  [
    {
      label: '¿Quiénes somos?',
      to: { name: 'about' },
    },
    {
      label: 'Nuestro equipo',
      to: { name: 'about' },
    },
  ],
];

const contactLinks = [
  [
    {
      label: 'Whatsapp',
      to: 'https://wa.me/+5350009047',
    },
    {
      label: 'Email',
      to: 'mailto:sigmacuba2023@gmail.com',
    },
  ],
];

const linkTitleStyles = `font-semibold ${useStyles().textSizeLG} ${useStyles().textColorPrimary}`;
const brandIconStyles = 'h-6 w-6 md:h-[26px] md:w-[26px]';

const year = new Date().getFullYear();
</script>

<template>
  <div
    class="grid grid-cols-2 grid-rows-2 items-center justify-between gap-y-3 pb-6 pt-3 md:grid-cols-3 md:grid-rows-1"
  >
    <!-- Copyrights -->
    <div class="justify-self-start">
      <span
        class="select-none font-semibold"
        :class="[useStyles().textColorPrimary, useStyles().textSizeSM]"
        >© {{ year }}, La Habana, Cuba</span
      >
    </div>

    <!-- Links -->
    <nav class="relative top-px flex items-center justify-self-end md:justify-self-center">
      <ul class="flex gap-4 lg:gap-8">
        <!-- Company -->
        <li>
          <UDropdown
            :items="companyLinks"
            mode="click"
            :popper="{ offsetDistance: 15, placement: 'top' }"
            :ui="{ width: 'w-min' }"
          >
            <button class="flex items-center justify-end">
              <UIcon
                name="i-charm-chevron-up"
                class="mr-0.5 md:mr-1"
                :class="useStyles().textColorPrimary"
              />
              <h4 :class="[linkTitleStyles]">Empresa</h4>
            </button>

            <template #item="{ item }">
              <span
                class="w-full truncate pl-1 pr-2 text-left"
                :class="[useStyles().textColorSecondary, useStyles().textSizeSM]"
                >{{ item.label }}</span
              >
            </template>
          </UDropdown>
        </li>

        <!-- Contact us -->
        <li>
          <UDropdown
            :items="contactLinks"
            mode="click"
            :popper="{ offsetDistance: 15, placement: 'top' }"
            :ui="{ width: 'w-min' }"
          >
            <button class="flex items-center justify-end">
              <UIcon
                name="i-charm-chevron-up"
                class="mr-0.5 md:mr-1"
                :class="useStyles().textColorPrimary"
              />
              <h4 :class="[linkTitleStyles]">Contáctanos</h4>
            </button>

            <template #item="{ item }">
              <span
                class="w-full truncate pl-2 pr-1 text-right"
                :class="[useStyles().textColorSecondary, useStyles().textSizeSM]"
                >{{ item.label }}</span
              >
            </template>
          </UDropdown>
        </li>
      </ul>
    </nav>

    <!-- Socials -->
    <nav class="col-span-2 flex items-center justify-self-center md:col-span-1 md:justify-self-end">
      <ul class="flex items-center gap-3 md:gap-1" :class="[useStyles().textColorPrimary]">
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
</template>
