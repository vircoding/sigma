<script setup lang="ts">
const props = defineProps<{
  name: string;
  errorVisibility: boolean;
  previousImages: string[];
}>();

const valOnChange = ref(false);
const customError = computed<{ error: boolean; message: string }>(() => {
  const length = list.value.length;

  if (length >= 1 && length <= 10) return { error: false, message: '' };
  else {
    if (length < 1) return { error: true, message: 'Debe contener al menos 1 imagen' };
    else return { error: true, message: 'Máximo 10 imágenes' };
  }
});

defineModel<Image[]>('images', { required: true });
const map = defineModel<UpdateImageMap>('map', { required: true });

const backendErrors = ref([false, false, false, false, false, false, false, false, false, false]);

const { errorMessage, validate } = useField(() => props.name, undefined, {
  syncVModel: 'images',
  validateOnMount: true,
});

const { update, push, remove } = useFieldArray<Image>(() => props.name);

const list = ref<
  {
    imageURL: string;
    absoluteIndex: number;
  }[]
>(props.previousImages.map((image, index) => ({ imageURL: image, absoluteIndex: index })));
const pushIndex = ref(props.previousImages.length);

function onUpdate(index: number, imageURL: string, blob: Blob, absoluteIndex: number) {
  if (backendErrors.value[index]) backendErrors.value[index] = false;

  if (map.value.new.includes(absoluteIndex)) {
    const mapIndex = map.value.new.indexOf(absoluteIndex);
    update(mapIndex, { imageURL, blob });
    validate();
  } else {
    push({ imageURL, blob });
    map.value.new.push(absoluteIndex);
    validate();
  }
  list.value[index] = { imageURL: imageURL, absoluteIndex };
}

function onPush(imageURL: string, blob: Blob) {
  push({ imageURL, blob });
  list.value.push({ imageURL, absoluteIndex: pushIndex.value });
  map.value.new.push(pushIndex.value);
  pushIndex.value++;
  valOnChange.value = true;
  validate();
}

function handleRemove(index: number, absoluteIndex: number) {
  if (map.value.new.includes(absoluteIndex)) {
    const mapIndex = map.value.new.indexOf(absoluteIndex);
    remove(mapIndex);
    map.value.new.splice(mapIndex, 1);
    validate();
  } else {
    map.value.removed.push(absoluteIndex);
  }
  list.value.splice(index, 1);
}

function onReset() {
  valOnChange.value = false;
  backendErrors.value = [false, false, false, false, false, false, false, false, false, false];
  list.value = props.previousImages.map((image, index) => ({
    imageURL: image,
    absoluteIndex: index,
  }));
  pushIndex.value = props.previousImages.length;
}

defineExpose<{
  setBackendError: (index: number) => void;
  reset: () => void;
}>({
  setBackendError: function (index: number) {
    backendErrors.value[index] = true;
  },
  reset: function () {
    onReset();
  },
});
</script>

<template>
  <UFormGroup
    size="md"
    label="Imágenes (Mínimo 1)"
    name="images"
    :error="
      ((valOnChange || props.errorVisibility) && errorMessage) ||
      (customError.error && customError.message)
    "
  >
    <template #label="{ label, error }">
      <span :class="[error ? useStyles().textColorError : undefined]">{{ label }}</span>
    </template>

    <template #hint="{ error }">
      <span
        class="mr-2"
        :class="[
          useStyles().textSizeXS,
          error ? useStyles().textColorError : useStyles().textColorPrimary,
        ]"
        >{{ list.length }}/10</span
      >
    </template>

    <template #default>
      <div
        class="mt-1 flex w-full items-center rounded-xl border border-gray-300 px-5 py-4 lg:min-h-[412px] dark:border-gray-700"
        :class="{
          'border-red-500 dark:border-red-400':
            (props.errorVisibility || valOnChange) && errorMessage,
        }"
      >
        <div
          class="relative flex h-fit w-full grid-cols-3 grid-rows-4 flex-col place-items-center items-center gap-x-3 gap-y-3 lg:grid"
        >
          <!-- Items -->
          <InputPostUpdateImageItem
            v-for="(image, index) in list"
            :key="image.imageURL"
            :index="index"
            :absolute-index="image.absoluteIndex"
            :image="image.imageURL"
            :backend-error="backendErrors[index]"
            @crop="onUpdate"
            @remove="handleRemove"
          />

          <!-- Add -->
          <InputPostImageAdd
            v-show="list.length < 10"
            :index="list.length"
            :error="(valOnChange || props.errorVisibility) && !!errorMessage"
            @crop="onPush"
          />
        </div>
      </div>
    </template>
  </UFormGroup>
</template>
