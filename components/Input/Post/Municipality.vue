<script setup lang="ts">
import type { Province } from '~/models/PostTypes';

const { getMunicipalitiesByProvince, defaultMunicipality } = useProvinces();

const props = defineProps<{
  index: number;
  province: Province;
}>();

const model = defineModel<string>({ required: true });

defineExpose<{
  setDefaultMunicipality: () => void;
}>({
  setDefaultMunicipality: function () {
    model.value = defaultMunicipality(props.province);

    console.log(model.value);
  },
});
</script>

<template>
  <UFormGroup size="md" label="Municipio" :name="`municipality-${index + 1}`">
    <template #label="{ label }">
      <span>{{ label }}</span>
    </template>

    <template #default>
      <USelectMenu
        v-model="model"
        selected-icon="i-solar-check-circle-bold"
        :options="getMunicipalitiesByProvince(props.province)"
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
