<script setup lang="ts">
const props = defineProps<{
  title: string;
  body: string;
}>();

const isModalOpen = ref(false);

const modalConfig = { container: 'items-center' };

defineExpose<{
  openModal: () => void;
}>({
  openModal: function () {
    isModalOpen.value = true;
  },
});
</script>

<template>
  <UModal v-model="isModalOpen" :ui="modalConfig">
    <UCard class="pt-0.5">
      <div class="flex flex-col gap-y-3">
        <div class="flex items-center justify-between">
          <!-- Title -->
          <h6
            class="font-ubuntu font-bold"
            :class="[useStyles().textSize2XL, useStyles().textColorPrimary]"
          >
            {{ props.title }}
          </h6>

          <!-- Close -->
          <ButtonIcon class="hidden md:block" @click="isModalOpen = false">
            <UIcon
              name="i-charm-cross"
              class="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
              :class="[useStyles().textColorPrimary]"
            />
          </ButtonIcon>
        </div>

        <!-- Paragraph -->
        <p class="mb-2" :class="[useStyles().textSizeSM, useStyles().textColorSecondary]">
          {{ props.body }}
        </p>

        <!-- CTA -->
        <aside class="flex justify-end">
          <UButton
            label="Aceptar"
            variant="solid"
            size="md"
            block
            :ui="useUIConfig().errorButtonConfig"
            class="w-min px-6 font-bold"
            @click="isModalOpen = false"
          />
        </aside>
      </div>
    </UCard>
  </UModal>
</template>
