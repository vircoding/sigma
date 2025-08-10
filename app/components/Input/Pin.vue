<script setup lang="ts">
const model = defineModel<string[]>();
const pinInputs = ref<(HTMLInputElement | null)[]>([]);

function handleInput(index: number) {
  if (model.value) {
    if (model.value[index]) {
      if (index < model.value.length - 1 && !model.value[index + 1]) {
        pinInputs.value[index + 1]?.focus();
      } else {
        removeFocusFromAllInputs();
      }
    }
  }
}

function removeFocusFromAllInputs() {
  pinInputs.value.forEach((input) => {
    if (input) input.blur();
  });
}

function handleKeyDown(index: number, event: KeyboardEvent) {
  if (model.value) {
    if (event.key === 'Backspace' && !model.value[index] && index > 0) {
      pinInputs.value[index - 1]?.focus();
    } else if (event.key === 'ArrowRight') {
      if (index < model.value.length - 1) {
        pinInputs.value[index + 1]?.focus();
      }
      event.preventDefault();
    } else if (event.key === 'ArrowLeft') {
      if (index > 0) {
        pinInputs.value[index - 1]?.focus();
      }
      event.preventDefault();
    }
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault();

  const clipboardData = event.clipboardData;
  const pastedData = clipboardData?.getData('text').trim();

  if (pastedData) {
    const digits = pastedData.match(/\d/g) || [];
    const limitedDigits = digits.slice(0, 6);

    if (limitedDigits.length === 6) {
      for (let i = 0; i < limitedDigits.length; i++) {
        if (model.value && i < model.value.length) {
          model.value[i] = limitedDigits[i];
        }
      }
    }
  }
}
</script>

<template>
  <div v-if="model" class="mt-2 flex justify-evenly">
    <input
      v-for="(digit, index) in model"
      ref="pinInputs"
      :key="index"
      v-model="model[index]"
      type="text"
      inputmode="numeric"
      maxlength="1"
      class="form-input focus:ring-primary-500 dark:focus:ring-primary-400 relative block h-10 w-10 rounded-xl border-0 bg-white px-3 py-1.5 text-center font-medium text-azure-950 placeholder-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-75 md:h-12 md:w-12 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-500 dark:ring-gray-700"
      :class="[useStyles().textColorPrimary, useStyles().textSizeXL]"
      @input="handleInput(index)"
      @keydown="handleKeyDown(index, $event)"
      @paste="handlePaste"
    />
  </div>
</template>
