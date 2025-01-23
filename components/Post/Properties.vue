<script setup lang="ts">
import type { Property } from '~/models/types/Post';

const props = defineProps<{
  properties: Property[];
  multiples: boolean;
}>();

const items = computed(() => {
  return props.properties.map((property, index) => ({
    label: `Propiedad ${index + 1}`,
    index: index,
  }));
});
</script>

<template>
  <section>
    <div class="lg:hidden">
      <div v-for="(property, index) in props.properties" :key="index">
        <!-- Mobile -->
        <aside v-if="multiples" :class="{ 'pt-3 md:pt-5': index >= 1 }">
          <span
            class="font-bold leading-none"
            :class="[useStyles().textColorPrimary, useStyles().textSizeLG]"
            >Propiedad {{ index + 1 }}</span
          >
        </aside>

        <PostProperty :property="property" />
      </div>
    </div>

    <!-- Desktop -->
    <div class="hidden lg:block">
      <UTabs
        v-if="props.multiples"
        :items="items"
        :default-index="0"
        :ui="{ wrapper: 'space-y-5' }"
      >
        <template #default="{ item, selected }">
          <span
            class="truncate text-sm font-semibold min-[341px]:text-base md:text-lg"
            :class="[
              selected ? 'text-primary-500 dark:text-primary-400' : useStyles().textColorSecondary,
            ]"
            >{{ item.label }}</span
          >
        </template>

        <template #item="{ item }">
          <PostProperty :property="properties[item.index]" />
        </template>
      </UTabs>

      <PostProperty v-else :property="properties[0]" />
    </div>

    <!-- Desktop Divider -->
    <UDivider type="dashed" class="hidden lg:block" />
  </section>
</template>
