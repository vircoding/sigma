import type { PostType } from '~/models/PostTypes';

export const useGlobalStore = defineStore('Global', () => {
  // State
  const insertType = ref<PostType>('sale');

  // Actions
  function setInsertType(newType: PostType) {
    insertType.value = newType;
  }

  function $reset() {
    insertType.value = 'sale';
  }

  return { insertType, setInsertType, $reset };
});
