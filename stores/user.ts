import type { User } from '~/models/types/User';

export const useUserStore = defineStore('User', () => {
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
