async function initAuth() {
  const authRoutes: string[] = [];
  const noAuthRoutes: string[] = [
    'auth-register',
    'auth-register-client',
    'auth-register-agent',
    'auth-login',
  ];

  const currentPath = useRoute().name?.toString();
  if (!currentPath) return showError(createError({ status: 500 }));

  if (noAuthRoutes.includes(currentPath)) {
    const sessionData = useSessionData();
    if (sessionData.value) return await navigateTo('/');
  } else if (authRoutes.includes(currentPath)) {
    const sessionData = useSessionData();
    if (!sessionData.value) return await navigateTo('/');
  }
}

export default function () {
  return { initAuth };
}
