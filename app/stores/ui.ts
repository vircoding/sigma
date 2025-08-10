export const useUIStore = defineStore('ui', () => {
  // State
  const preventNavigate = ref(false);
  const insertPagePostType = ref<PostType>('sale');
  const updatePagePostType = ref<PostType>('sale');
  const searchPagePostType = ref<PostType>('sale');
  const postPagePostType = ref<PostType>('sale');

  // Getters
  const colorPostType = computed<PostType>(() => {
    const route = useRoute();
    const name = route.name?.toString();

    if (name) {
      switch (name) {
        case 'insert':
          return insertPagePostType.value;
        case 'update-post-id':
          return updatePagePostType.value;
        case 'posts':
          return searchPagePostType.value;
        case 'posts-id':
          return postPagePostType.value;
        default:
          return 'sale';
      }
    }

    return 'sale';
  });

  // Actions
  function setPreventNavigate(newState: boolean) {
    preventNavigate.value = newState;
  }

  function setInsertPagePostType(newType: PostType) {
    insertPagePostType.value = newType;
  }

  function setUpdatePagePostType(newType: PostType) {
    updatePagePostType.value = newType;
  }

  function setSearchPagePostType(newType: PostType) {
    searchPagePostType.value = newType;
  }

  function setPostPagePostType(newType: PostType) {
    postPagePostType.value = newType;
  }

  function $reset() {
    preventNavigate.value = false;
    insertPagePostType.value = 'sale';
    updatePagePostType.value = 'sale';
    searchPagePostType.value = 'sale';
    postPagePostType.value = 'sale';
  }

  return {
    preventNavigate,
    insertPagePostType,
    updatePagePostType,
    searchPagePostType,
    postPagePostType,
    colorPostType,
    setInsertPagePostType,
    setUpdatePagePostType,
    setSearchPagePostType,
    setPostPagePostType,
    setPreventNavigate,
    $reset,
  };
});
