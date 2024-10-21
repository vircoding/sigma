<template>
  <div
    class="relative top-4 aspect-square w-24 min-w-24 min-[375px]:w-28 min-[375px]:min-w-28 md:top-6"
  >
    <div class="overflow-hidden rounded-full border border-gray-300 dark:border-gray-700">
      <PlaceholderAvatar class="h-full w-full text-gray-300 dark:text-gray-700" />
      <div
        class="absolute right-0 top-[82px] flex rounded-full border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-neutral-900"
      >
        <ButtonIcon>
          <UIcon
            name="i-solar-add-circle-broken"
            class="h-5 w-5"
            :class="useStyles().textColorPrimary"
          />
        </ButtonIcon>
      </div>
    </div>
  </div>
</template>
