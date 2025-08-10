<script setup lang="ts">
import parsePhoneNumber from 'libphonenumber-js';

const props = defineProps<{
  whatsapp: boolean;
  phone: string;
  id: string;
}>();

const formattedPhone = computed(() => {
  const parsed = parsePhoneNumber(props.phone);

  if (!parsed) return props.phone;

  if (parsed.country === 'CU') return parsed.nationalNumber;

  return props.phone;
});

const whatsappMessage = `Mira esta publicación en Sigma:
https://sigmacuba.com/posts/${props.id}`;
</script>

<template>
  <nav class="sticky bottom-3 z-50 md:bottom-5 lg:relative lg:bottom-0 lg:z-0">
    <div
      class="relative grid max-w-lg grid-cols-2 gap-x-2 rounded-2xl bg-gray-300/30 p-2 backdrop-blur-md lg:left-0 lg:w-full lg:max-w-none lg:gap-x-3 lg:bg-transparent lg:p-0 lg:backdrop-blur-none dark:bg-gray-500/30 lg:dark:bg-transparent"
    >
      <!-- Call -->
      <UButton
        :label="formattedPhone"
        :to="`tel:${props.phone}`"
        size="md"
        block
        :ui="props.whatsapp ? useUIConfig().cancelButtonConfig : useUIConfig().acceptButtonConfig"
        class="gap-x-1 font-bold md:gap-x-1.5"
        :class="{ 'col-span-2': !props.whatsapp }"
      >
        <template #leading>
          <UIcon name="i-solar-phone-calling-outline" class="h-5 w-5 md:h-6 md:w-6" />
        </template>
      </UButton>

      <!-- Whatsapp -->
      <UButton
        v-if="props.whatsapp"
        :label="formattedPhone"
        :to="`https://wa.me/${props.phone}?text=${encodeURIComponent(whatsappMessage)}`"
        size="md"
        block
        :ui="useUIConfig().acceptButtonConfig"
        class="gap-x-1 font-bold md:gap-x-1.5"
      >
        <template #leading>
          <UIcon name="i-fa6-brands-whatsapp" class="h-5 w-5 md:h-6 md:w-6" />
        </template>
      </UButton>
    </div>
  </nav>
</template>
