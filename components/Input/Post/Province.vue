<script setup lang="ts">
import type { Province } from '~/models/PostTypes';

const props = defineProps<{
  index: number;
}>();

defineEmits<{
  (e: 'change', index: number): void;
}>();

const provinces = useProvinces().getProvinces();

const model = defineModel<Province>({ required: true });
</script>

<template>
  <UFormGroup size="md" label="Provincia" :name="`province-${props.index + 1}`">
    <template #label="{ label }">
      <span>{{ label }}</span>
    </template>

    <template #default>
      <USelectMenu
        v-model="model"
        selected-icon="i-solar-check-circle-bold"
        :options="provinces"
        :ui-menu="{
          option: {
            base: 'cursor-pointer',
            selectedIcon: {
              base: `${useStyles().textColorPrimary}`,
            },
          },
          select: 'cursor-pointer',
          popper: {
            placement: 'bottom-start',
          },
        }"
        @change="$emit('change', index)"
      >
        <template #label>
          <span :class="[useStyles().textSizeBase, useStyles().textColorPrimary]">{{ model }}</span>
        </template>

        <template #trailing>
          <UIcon
            name="i-heroicons-chevron-down-20-solid"
            class="h-5 w-5"
            :class="[useStyles().textColorPrimary]"
          />
        </template>
      </USelectMenu>
    </template>
  </UFormGroup>
</template>
