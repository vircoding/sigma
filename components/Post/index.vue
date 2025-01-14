<script setup lang="ts">
import type { PostData } from '~/server/models/Types';

defineEmits<{
  (e: 'share'): void;
}>();

const { user } = useUserStore();

const isOwn = computed(() => {
  return user?.id === props.post.author.authorId;
});

const props = defineProps<{
  post: PostData;
}>();
</script>

<template>
  <div class="flex flex-col">
    <!-- Gallery -->
    <div class="absolute left-[0vw] top-[72px] sm:top-[84px]">
      <PostGallery :images="props.post.images" />
    </div>

    <!-- Details -->
    <div class="flex flex-col pt-[calc(100vw/1.78)]">
      <!-- Hero -->
      <section class="flex flex-col py-3">
        <!-- Top -->
        <div
          class="flex items-center justify-between font-ubuntu"
          :class="[useStyles().textColorPrimary]"
        >
          <!-- Sale Info -->
          <div v-if="props.post.type === 'sale'">
            <span class="font-black" :class="[useStyles().textSize3XL]"
              >{{ props.post.amount }}
              <span class="font-semibold" :class="[useStyles().textSizeXL]">{{
                props.post.currency
              }}</span></span
            >
          </div>

          <!-- Rent Info -->
          <div v-if="props.post.type === 'rent'">
            <span class="font-bold" :class="[useStyles().textSize3XL]"
              >{{ props.post.tax }}
              <span class="font-semibold" :class="[useStyles().textSizeXL]"
                >{{ props.post.currency }} /
                {{ props.post.frequency === 'daily' ? 'día' : 'mes' }}</span
              ></span
            >
          </div>

          <!-- Exchange Info -->
          <div v-if="props.post.type === 'exchange'">
            <span class="font-bold" :class="[useStyles().textSize3XL]"
              >56,000 <span class="font-semibold" :class="[useStyles().textSizeXL]">USD</span></span
            >
          </div>

          <!-- CTA's -->
          <div class="flex items-center gap-x-1">
            <!-- Edit -->
            <NuxtLink
              v-if="isOwn"
              :to="{ name: 'update-post-id', params: { id: props.post.id } }"
              class="flex items-center"
            >
              <UIcon
                name="i-solar-pen-bold"
                class="h-[30px] w-[30px]"
                :class="[useStyles().textColorPrimary]"
              />
            </NuxtLink>

            <!-- Share -->
            <ButtonIcon @click="$emit('share')">
              <UIcon
                name="i-solar-share-bold"
                class="h-8 w-8"
                :class="[useStyles().textColorPrimary]"
              />
            </ButtonIcon>
          </div>
        </div>

        <!-- Address -->
        <aside>
          <span
            >{{ props.post.properties[0].address.municipality }},
            {{ props.post.properties[0].address.province }}</span
          >
        </aside>
      </section>

      <!-- Divider -->
      <UDivider type="dashed" />

      <!-- Features -->
      <section class="grid grid-cols-4 grid-rows-2 gap-y-2 pb-5 pt-3">
        <!-- Bed -->
        <PostFeatureNumeric
          label="Cuartos"
          :count="props.post.properties[0].features.bed"
          class="col-start-1 row-start-1"
        >
          <template #icon>
            <IconFeatureBed />
          </template>
        </PostFeatureNumeric>

        <!-- Bath -->
        <PostFeatureNumeric
          label="Baños"
          :count="props.post.properties[0].features.bath"
          class="col-start-2 row-start-1"
        >
          <template #icon>
            <IconFeatureBath />
          </template>
        </PostFeatureNumeric>

        <!-- Garage -->
        <PostFeatureBoolean
          label="Garage"
          :state="props.post.properties[0].features.garage"
          class="col-start-3 row-start-1"
        >
          <template #icon>
            <IconFeatureGarage />
          </template>
        </PostFeatureBoolean>

        <!-- Garden -->
        <PostFeatureBoolean
          label="Jardín"
          :state="props.post.properties[0].features.garden"
          class="col-start-1 row-start-2"
        >
          <template #icon>
            <IconFeatureGarden />
          </template>
        </PostFeatureBoolean>

        <!-- Pool -->
        <PostFeatureBoolean
          label="Piscina"
          :state="props.post.properties[0].features.pool"
          class="col-start-2 row-start-2"
        >
          <template #icon>
            <IconFeaturePool />
          </template>
        </PostFeatureBoolean>

        <!-- Furnished -->
        <PostFeatureBoolean
          label="Amueblada"
          :state="props.post.properties[0].features.furnished"
          class="col-start-3 row-start-2"
        >
          <template #icon>
            <IconFeatureFurnished />
          </template>
        </PostFeatureBoolean>
      </section>

      <!-- Divider -->
      <UDivider type="dashed" />

      <!-- Description -->
      <section class="py-3.5">
        <p class="whitespace-pre-wrap">
          {{ props.post.description.length === 0 ? 'Sin Descripción :(' : props.post.description }}
        </p>
      </section>

      <!-- Divider -->
      <UDivider type="dashed" />

      <!-- Agent Details -->
      <section v-if="props.post.author.agent" class="py-3.5">
        <div class="flex items-center gap-x-2">
          <img :src="props.post.author.agent.avatar" class="aspect-square w-1/5 rounded-full" />
          <div class="flex w-4/5 flex-col">
            <span class="leading-none"
              >Por
              <span class="font-bold" :class="[useStyles().textColorPrimary]"
                >{{ props.post.author.agent.firstname }}
                {{ props.post.author.agent.lastname }}</span
              ></span
            >
            <span :class="[useStyles().textSizeSM]">{{ props.post.author.agent.email }}</span>
          </div>
        </div>
      </section>
    </div>

    <!-- Phone Actions -->
    <section class="sticky bottom-[0vh] z-50">
      <PostPhone v-bind="{ ...props.post.contact, id: props.post.id }" />
    </section>
  </div>
</template>
