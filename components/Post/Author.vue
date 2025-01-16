<script setup lang="ts">
const props = defineProps<{
  firstname: string;
  lastname: string;
  avatar: string;
  email: string;
}>();
</script>

<template>
  <section class="py-3.5 md:py-[22px]">
    <div class="flex items-center gap-x-2 min-[380px]:gap-x-3 min-[545px]:gap-x-4 lg:gap-x-[18px]">
      <img :src="props.avatar" class="aspect-square w-1/5 rounded-full md:w-1/4 lg:w-1/5" />
      <div class="flex w-4/5 flex-col md:w-3/4 lg:w-4/5 lg:gap-y-1 lg:text-xl">
        <span class="leading-none"
          >Por
          <span class="font-bold" :class="[useStyles().textColorPrimary]"
            >{{ props.firstname }} {{ props.lastname }}</span
          ></span
        >
        <span class="text-sm md:text-base lg:text-lg">{{ props.email }}</span>
      </div>
    </div>
  </section>
</template>
