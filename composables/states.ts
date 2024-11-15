type UserData =
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

// User Data
export function useUserData() {
  return useState<UserData | undefined>('userData');
}

export function clearUserData() {
  useUserData().value = undefined;
}

// Session Data
export function useSessionData() {
  return useState<
    | {
        accessToken: string;
      }
    | undefined
  >('sessionData');
}

export function clearSessionData() {
  useSessionData().value = undefined;
}

// Init Loading
export function useInitLoading() {
  return useState<boolean>('initLoading', () => true);
}

export function clearInitLoading() {
  useInitLoading().value = false;
}
