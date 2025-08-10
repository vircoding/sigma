export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | undefined>(undefined);

  // Actions
  function setUser(newUser: User) {
    user.value = newUser;
  }

  function $reset() {
    user.value = undefined;
  }

  return { user, $reset, setUser };
});
