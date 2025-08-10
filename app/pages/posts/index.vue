<script setup lang="ts">
import { searchSchema } from '~/schemas/SearchSchema';
import type { SearchSchema } from '~/schemas/SearchSchema';

const uiStore = useUIStore();
const { searchPagePostType } = storeToRefs(uiStore);

const state = reactive<SearchInput>({
  type: searchPagePostType.value,
});

const { handleSubmit, setFieldError, isSubmitting } = useForm<SearchSchema>({
  validationSchema: toTypedSchema(searchSchema),
});

function onTypeChange(newType: PostType) {
  uiStore.setSearchPagePostType(newType);
}

watch(searchPagePostType, (newType) => {
  state.type = newType;
});

const posts = ref<SearchResult[]>([]);
const { data, status, error } = useLazyFetch(
  `/api/search?data=${JSON.stringify({ type: 'sale' })}`,
);

function onStatus() {
  if (status.value === 'success' && data.value) {
    posts.value = posts.value.concat(data.value.posts);
  } else if (status.value === 'error' && error.value) {
    console.log(error.value);
  }
}

watch(status, () => {
  onStatus();
});

onMounted(() => {
  onStatus();
});
</script>

<template>
  <UContainer class="w-full grow px-0 min-[350px]:px-4" :class="[useStyles().pageContainer]">
    <div>
      <!-- Hero -->
      <section class="mb-7 flex flex-col gap-2 lg:mb-0">
        <h2
          class="font-ubuntu font-bold"
          :class="[useStyles().textColorPrimary, useStyles().textSize4XL]"
        >
          Descubrir casas
        </h2>
        <p>Encuentra anuncios según tus necesidades.</p>
      </section>

      <InputPostType v-model="state.type" name="type" @change="onTypeChange"></InputPostType>

      <!-- Posts w/ Infinite Scroll -->
      <div class="flex flex-col items-center gap-y-6">
        <CardFullPost v-for="post in posts" :key="post.id" :post="post" />
      </div>

      <!-- Posts Skeletons -->
      <div v-if="status === 'pending'">
        <h6>Skeleton</h6>
      </div>

      <!-- Filters Container -->
    </div>
  </UContainer>
</template>
