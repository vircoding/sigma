import { FetchError } from 'ofetch';
import type { RegisterClientSchema, RegisterAgentSchema } from '~/models/ValSchema';
import {
  FormFieldError,
  BadRequestError,
  ConflictError,
  FatalError,
  MaxSizeError,
  NotFoundError,
  BadCredentialsError,
  RefreshTokenExpiredError,
  InvalidRefreshTokenError,
  AccessTokenExpiredError,
} from '~/models/Error';

async function registerClient(body: RegisterClientSchema) {
  try {
    const formData = new FormData();
    formData.append('input', JSON.stringify({ type: 'client', ...body }));

    await $fetch('/api/auth/register', {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 409 && error.data.message === 'User exists already')
        throw new ConflictError(error.message);
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function registerAgent(
  body: Omit<RegisterAgentSchema, 'code' | 'avatar'> & {
    avatar?: Blob;
  },
) {
  try {
    const formData = new FormData();
    formData.append('input', JSON.stringify({ type: 'agent', ...body }));
    if (body.avatar) formData.append('avatar', body.avatar);

    await $fetch('/api/auth/register', {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 409 && error.data.message === 'User exists already')
        throw new ConflictError(error.message);
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        if (error.data.message === 'File exceeds the maximum allowed size of 5MB')
          throw new MaxSizeError(error.message);
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function resendVerificationEmail(email: string) {
  try {
    await $fetch('/api/auth/verify/resend', {
      method: 'POST',
      body: { email },
    });
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 404 && error.data.message === 'User not found')
        throw new NotFoundError(error.message);
      if (error.statusCode === 409 && error.data.message === 'This account is verified already')
        throw new ConflictError(error.message);
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function login(body: { email: string; password: string }) {
  const userStore = useUserStore();

  try {
    const data = await $fetch('/api/auth/login', { method: 'POST', body });
    const accessToken = useCookie('access_token');
    accessToken.value = data.access_token;
    userStore.setUser(data.user);
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 401 && error.data.message === 'Bad credentials')
        throw new BadCredentialsError(error.message);
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function refresh() {
  try {
    const data = await $fetch('/api/auth/refresh', { method: 'POST' });
    useCookie('access_token').value = data.access_token;
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 401 && error.data.message === 'The refresh token has expired')
        throw new RefreshTokenExpiredError(error.message);
      if (error.status === 400 && error.data.message === 'Invalid or missing refresh token') {
        throw new InvalidRefreshTokenError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function logout() {
  const userStore = useUserStore();

  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    useCookie('access_token').value = null;
    userStore.$reset();
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 401 && error.data.message === 'The refresh token has expired') {
        useCookie('access_token').value = null;
        userStore.$reset();

        throw new RefreshTokenExpiredError(error.message);
      }
      if (error.status === 400 && error.data.message === 'Invalid or missing refresh token') {
        useCookie('access_token').value = null;
        userStore.$reset();

        throw new InvalidRefreshTokenError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function updateAgent(body: {
  firstname?: string;
  lastname?: string;
  phone?: string;
  bio?: string;
  avatar?: Blob;
}) {
  const userStore = useUserStore();

  try {
    const formData = new FormData();
    formData.append('input', JSON.stringify({ type: 'agent', ...body }));
    if (body.avatar) formData.append('avatar', body.avatar);

    const data = await $fetch('/api/auth', {
      method: 'PATCH',
      body: formData,
      headers: {
        Authorization: `Bearer ${useCookie('access_token').value}`,
      },
    });

    userStore.setUser(data.user);
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 401 && error.data.message === 'The access token has expired') {
        throw new AccessTokenExpiredError(error.message);
      }
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters' && 'data' in error.data)
          throw new FormFieldError(error.message, error.data.data);
        if (error.data.message === 'File exceeds the maximum allowed size of 5MB')
          throw new MaxSizeError(error.message);
        if (error.data.message === 'Invalid or missing access token') throw new FatalError();
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError();
  }
}

export default function () {
  return {
    registerClient,
    registerAgent,
    resendVerificationEmail,
    login,
    refresh,
    logout,
    updateAgent,
  };
}
