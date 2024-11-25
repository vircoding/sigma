type User =
  | {
      type: 'client';
      id: string;
    }
  | {
      type: 'agent';
      avatar: string;
      firstname: string;
      lastname: string;
      phone: string;
      bio: string;
      id: string;
    };

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
