import type { PostType } from '~/models/PostTypes';

export const useGlobalStore = defineStore('Global', () => {
  // State
  const abortNavigate = ref(false);
  const insertType = ref<PostType>('sale');

  // Actions
  function setAbortNavigate(newAbort: boolean) {
    abortNavigate.value = newAbort;
  }

  function setInsertType(newType: PostType) {
    insertType.value = newType;
  }

  function $reset() {
    abortNavigate.value = false;
    insertType.value = 'sale';
  }

  return { insertType, abortNavigate, setAbortNavigate, setInsertType, $reset };
});
