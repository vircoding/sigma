<script setup lang="ts">
const props = defineProps<{
  type: 'sale' | 'rent' | 'exchange';
}>();

const emit = defineEmits<{
  (e: 'input'): void;
}>();

const model = defineModel<string>();
const input = ref<HTMLInputElement | null>();

const getBackgroundColor = computed(() => {
  switch (props.type) {
    case 'rent':
      return 'bg-keppel-100 dark:bg-keppel-950/50';
    case 'exchange':
      return 'bg-affair-100 dark:bg-affair-950/30';
    default:
      return 'bg-azure-100 dark:bg-azure-950/50';
  }
});

const getTextColor = computed(() => {
  switch (props.type) {
    case 'rent':
      return 'text-keppel-500 dark:text-keppel-400';
    case 'exchange':
      return 'text-affair-500 dark:text-affair-400';
    default:
      return 'text-azure-500 dark:text-azure-400';
  }
});

const getFocusColor = computed(() => {
  switch (props.type) {
    case 'rent':
      return 'focus:ring-keppel-500 dark:focus:ring-keppel-400';
    case 'exchange':
      return 'focus:ring-affair-500 dark:focus:ring-affair-400';
    default:
      return 'focus:ring-azure-500 dark:focus:ring-azure-400';
  }
});

function onBlur() {
  if (model.value === '') model.value = '0';
}

function onInput() {
  if (model.value && model.value.length >= 1) {
    input.value?.blur();
    emit('input');
  }
}

function onUp() {
  if (model.value) {
    if (model.value !== '') {
      const numericValue = Number(model.value);

      if (numericValue < 9) model.value = (numericValue + 1).toString();
    }
  } else model.value = '1';

  emit('input');
}

function onDown() {
  if (model.value) {
    const numericValue = Number(model.value);

    if (numericValue > 0) model.value = (numericValue - 1).toString();
  }

  emit('input');
}
</script>

<template>
  <div class="mt-1 flex items-center gap-x-2 min-[380px]:ml-5 min-[380px]:gap-x-3">
    <input
      ref="input"
      v-model.trim="model"
      type="text"
      inputmode="numeric"
      maxlength="1"
      class="form-input relative block h-9 w-9 rounded-xl border-0 bg-white px-3 py-1.5 text-center placeholder-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-75 md:h-10 md:w-10 dark:bg-gray-900 dark:placeholder-gray-500 dark:ring-gray-700"
      :class="[useStyles().textColorPrimary, useStyles().textSizeBase, getFocusColor]"
      @input="onInput"
      @blur="onBlur"
    />

    <!-- Up Button -->
    <ButtonIcon
      class="flex h-7 w-7 items-center justify-center rounded-xl md:h-8 md:w-8"
      :class="[getBackgroundColor]"
      @click="onUp"
    >
      <UIcon
        name="i-heroicons-chevron-up-20-solid"
        class="h-5 w-5 md:h-7 md:w-7"
        :class="[getTextColor]"
      />
    </ButtonIcon>

    <!-- Down Button -->
    <ButtonIcon
      class="flex h-7 w-7 items-center justify-center rounded-xl md:h-8 md:w-8"
      :class="[getBackgroundColor]"
      @click="onDown"
    >
      <UIcon
        name="i-heroicons-chevron-down-20-solid"
        class="h-5 w-5 md:h-7 md:w-7"
        :class="[getTextColor]"
      />
    </ButtonIcon>
  </div>
</template>
