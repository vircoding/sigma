<script setup lang="ts">
import type { Province } from '~/models/PostTypes';

const props = defineProps<{
  province: Province;
  municipality: string;
  index: number;
  provinceName: string;
  municipalityName: string;
}>();

const { getProvinces, getMunicipalitiesByProvince, defaultMunicipality } = useProvinces();

const provinces = getProvinces();

const { value: provinceValue } = useField<Province>(() => props.provinceName, undefined, {
  syncVModel: 'province',
});

const { value: municipalityValue } = useField<string>(() => props.municipalityName, undefined, {
  syncVModel: 'municipality',
});

const state = ref<{ province: Province; municipality: string }>({
  province: provinceValue.value,
  municipality: municipalityValue.value,
});

watch(state.value, () => {
  provinceValue.value = state.value.province;
  municipalityValue.value = state.value.municipality;
});
</script>

<template>
  <div class="w-full place-content-center lg:max-w-sm">
    <!-- Province -->
    <div class="mb-4 w-full">
      <UFormGroup size="md" label="Provincia" :name="`province-${props.index + 1}`">
        <template #label="{ label }">
          <span>{{ label }}</span>
        </template>

        <template #default>
          <USelectMenu
            v-model="state.province"
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
            @change="state.municipality = defaultMunicipality(state.province)"
          >
            <template #label>
              <span :class="[useStyles().textSizeBase, useStyles().textColorPrimary]">{{
                provinceValue
              }}</span>
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
    </div>

    <!-- Municipality -->
    <div class="mb-4 w-full lg:mb-2.5">
      <UFormGroup size="md" label="Municipio" :name="`municipality-${props.index + 1}`">
        <template #label="{ label }">
          <span>{{ label }}</span>
        </template>

        <template #default>
          <USelectMenu
            v-model="state.municipality"
            selected-icon="i-solar-check-circle-bold"
            :options="getMunicipalitiesByProvince(state.province)"
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
              <span :class="[useStyles().textSizeBase, useStyles().textColorPrimary]">{{
                municipalityValue
              }}</span>
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
    </div>
  </div>
</template>
