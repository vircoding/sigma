<script setup lang="ts">
type Value = 0 | 1 | 2 | 3;
type Option = { value: Value; label: string };

const props = defineProps<{
  init: Value;
}>();

const emit = defineEmits<{
  (e: 'change', value: Value): void;
}>();

const options: Option[] = [
  { value: 0, label: 'Sin Especificar' },
  { value: 1, label: '1 Propiedad' },
  { value: 2, label: '2 Propiedades' },
  { value: 3, label: '3 Propiedades' },
];

const state = ref(options[props.init]);

function onChange() {
  emit('change', state.value.value);
}
</script>

<template>
  <UFormGroup size="md" label="Necesitas" name="needs">
    <template #label="{ label }">
      <span>{{ label }}</span>
    </template>

    <template #default>
      <USelectMenu
        v-model="state"
        selected-icon="i-solar-check-circle-bold"
        :options="options"
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
        @change="onChange"
      >
        <template #label>
          <span :class="[useStyles().textSizeBase, useStyles().textColorPrimary]">{{
            state.label
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

    <template #error="{ error }">
      <span :class="[useStyles().textSizeSM, useStyles().textColorError]">
        {{ error }}
      </span>
    </template>
  </UFormGroup>
</template>
