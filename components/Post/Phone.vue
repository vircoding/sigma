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
  <div
    class="relative -left-4 grid w-[calc(100vw-32px)] grid-cols-2 gap-x-2 rounded-2xl bg-gray-300/30 p-2 backdrop-blur-md dark:bg-gray-500/30"
  >
    <!-- Call -->
    <UButton
      :label="formattedPhone"
      :to="`tel:${props.phone}`"
      size="md"
      block
      :ui="props.whatsapp ? useUIConfigs().cancelButtonConfig : useUIConfigs().acceptButtonConfig"
      class="gap-x-1 font-bold"
    >
      <template #leading>
        <UIcon name="i-solar-phone-calling-outline" class="h-5 w-5" />
      </template>
    </UButton>

    <!-- Whatsapp -->
    <UButton
      v-if="props.whatsapp"
      :label="formattedPhone"
      :to="`https://wa.me/${props.phone}?text=${encodeURIComponent(whatsappMessage)}`"
      size="md"
      block
      :ui="useUIConfigs().acceptButtonConfig"
      class="gap-x-1 font-bold"
    >
      <template #leading>
        <UIcon name="i-fa6-brands-whatsapp" class="h-5 w-5" />
      </template>
    </UButton>
  </div>
</template>
