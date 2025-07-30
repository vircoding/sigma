<script setup lang="ts">
import type { UserPost } from '~/models/types/Post';
import { AccessTokenExpiredError } from '~/models/classes/client/Error';

const props = defineProps<{
  post: UserPost;
}>();

const emit = defineEmits<{
  (e: 'closeModal' | 'postDeleted'): void;
}>();

const { deletePost } = useUser();
const { refresh } = useAuth();
const url = useRouter().resolve({ name: 'posts-id', params: { id: props.post.id } });
const isDeleteConfirm = ref(false);
const isLoading = ref(false);

const color = computed(() => {
  switch (props.post.type) {
    case 'rent':
      return 'keppel';
    case 'exchange':
      return 'affair';
    default:
      return 'azure';
  }
});

async function onNavigate(id: string) {
  await navigateTo({ name: 'posts-id', params: { id } });
  emit('closeModal');
}

function onShare() {
  const shareData = {
    title: 'Publicación en Sigma',
    text: 'Mira esta casa',
    url: url.fullPath,
  };

  navigator.share(shareData).catch();
}

async function onEdit() {
  await navigateTo({ name: 'update-post-id', params: { id: props.post.id } });
  emit('closeModal');
}

function onDelete() {
  isDeleteConfirm.value = true;
}

function onDeleteCancel() {
  isDeleteConfirm.value = false;
}

async function onDeleteConfirm() {
  isLoading.value = true;

  try {
    await deletePost(props.post.id);

    // Check if is on a related route
    const route = useRoute();
    if (
      ['posts-id', 'update-post-id'].includes(route.name?.toString() || '') &&
      route.params.id === props.post.id
    )
      await navigateTo({ name: 'index' });

    emit('postDeleted');
    isDeleteConfirm.value = false;
  } catch (error) {
    if (error instanceof AccessTokenExpiredError) {
      await refresh().catch(() => showError(createError({ status: 500 })));
    } else showError(createError({ status: 500 }));
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <button
    type="button"
    class="grid-card w-full max-w-72 md:max-w-none"
    @click="onNavigate(post.id)"
  >
    <!-- Card -->
    <div class="relative flex flex-col overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700">
      <!-- Top -->
      <div
        class="flex h-[82px] w-full justify-between bg-gray-100 shadow-sm md:h-24 dark:bg-gray-800"
      >
        <!-- Details -->
        <CardMinimalPostDetails :post="props.post" />

        <!-- Exchange Multi-Offer Features -->
        <CardMinimalPostFeatureMulti
          v-if="props.post.type === 'exchange' && props.post.details.offers > 1"
          :post="props.post"
        />

        <!-- Features -->
        <div v-else class="flex flex-grow flex-col items-center justify-center">
          <CardMinimalPostFeature
            :features="props.post.properties[0].features"
            :gap-compress="false"
            :color="color"
          />
        </div>
      </div>

      <!-- Buttons -->
      <aside class="flex items-center justify-evenly gap-x-2 px-6 py-2">
        <!-- Share -->
        <ButtonIcon @click.stop="onShare">
          <UIcon
            name="i-solar-share-bold"
            class="h-5 w-5 md:h-6 md:w-6"
            :class="[useStyles().textColorPrimary]"
          />
        </ButtonIcon>

        <!-- Edit -->
        <ButtonIcon @click.stop="onEdit">
          <UIcon
            name="i-solar-pen-bold"
            class="h-[18px] w-[18px] md:h-[22px] md:w-[22px]"
            :class="[useStyles().textColorPrimary]"
          />
        </ButtonIcon>

        <!-- Delete -->
        <ButtonIcon @click.stop="onDelete">
          <UIcon
            name="i-solar-trash-bin-trash-broken"
            class="h-5 w-5 md:h-6 md:w-6"
            :class="[useStyles().textColorPrimary]"
          />
        </ButtonIcon>
      </aside>

      <!-- Delete Confirm -->
      <div
        v-show="isDeleteConfirm"
        class="absolute bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-center justify-center gap-y-3 bg-gray-300/30 px-5 py-2 backdrop-blur-md md:px-7 md:py-3 dark:bg-gray-950/30"
      >
        <p :class="[useStyles().textSizeBase, useStyles().textColorPrimary]">
          ¿Estás seguro que deseas eliminar esta publicación?
        </p>
        <!-- Actions -->
        <div class="grid grid-cols-2 gap-x-6">
          <!-- Cancel -->
          <UButton
            label="Cancelar"
            variant="solid"
            size="md"
            block
            :disabled="isLoading"
            :ui="useUIConfigs().blurCancelButtonConfig"
            class="font-quicksand font-bold"
            @click.stop="onDeleteCancel"
          />

          <!-- Confirm -->
          <UButton
            label="Eliminar"
            variant="solid"
            size="md"
            block
            :disabled="isLoading"
            :ui="useUIConfigs().errorButtonConfig"
            class="font-quicksand font-bold"
            @click.stop="onDeleteConfirm"
          />
        </div>
      </div>
    </div>
  </button>
</template>

<style lang="css" scoped>
@media (min-width: 640px) {
  .grid-template > .grid-card:last-child:nth-child(odd) {
    position: relative;
    left: 50%;
  }
}
</style>
