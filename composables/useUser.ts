import { FetchError } from 'ofetch';
import type { UpdateAgentSchema } from '~/models/schemas/client/UpdateAgentSchema';
import {
  FormFieldError,
  BadRequestError,
  FatalError,
  MaxSizeError,
  AccessTokenExpiredError,
  MaxImageSizeError,
} from '~/models/classes/client/Error';
import parsePhoneNumber from 'libphonenumber-js';
import type {
  UpdateSaleSchema,
  UpdateRentSchema,
  UpdateExchangeSchema,
} from '~/models/schemas/client/UpdatePostSchema';

const countries = useCountries().countries;

function parsePhone(phone: string) {
  const parsedPhone = parsePhoneNumber(phone);

  if (parsedPhone) {
    const country = countries.find(
      (country) => country.code === parsedPhone.country?.toLowerCase(),
    );

    if (country) {
      return {
        code: country.callingCode,
        phone: parsedPhone.nationalNumber,
      };
    } else throw showError(createError({ status: 500 }));
  } else throw showError(createError({ status: 500 }));
}

async function updateAgent(body: UpdateAgentSchema) {
  const userStore = useUserStore();

  try {
    const formData = new FormData();
    formData.append(
      'input',
      JSON.stringify({
        type: 'agent',
        firstname: body.firstname,
        lastname: body.lastname,
        bio: body.bio,
        phone: `+${body.phone.code}${body.phone.phone}`,
      }),
    );

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

async function updateSale(
  body: UpdateSaleSchema,
  id: string,
  map: {
    new: number[];
    removed: number[];
  },
) {
  try {
    const formData = new FormData();
    formData.append(
      'input',
      JSON.stringify({
        type: 'sale',
        amount: body.amount,
        currency: body.currency,
        description: body.description,
        properties: body.properties,
        phone: `+${body.phone.code}${body.phone.phone}`,
        whatsapp: body.whatsapp,
      }),
    );

    body.images.forEach((image) => {
      formData.append('images', image.blob);
    });

    formData.append('map', JSON.stringify(map));

    const data = await $fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      body: formData,
      headers: {
        Authorization: `Bearer ${useCookie('access_token').value}`,
      },
    });

    return { postId: data.postId };
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 401 && error.data.message === 'The access token has expired') {
        throw new AccessTokenExpiredError(error.message);
      }
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters')
          throw new BadRequestError(error.message);
        if (
          error.data.message === 'File exceeds the maximum allowed size of 5MB' &&
          'data' in error.data &&
          'index' in error.data.data
        )
          throw new MaxImageSizeError(error.message, error.data.data.index);
        if (error.data.message === 'Invalid or missing access token') throw new FatalError();
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function updateRent(
  body: UpdateRentSchema,
  id: string,
  map: {
    new: number[];
    removed: number[];
  },
) {
  try {
    const formData = new FormData();
    formData.append(
      'input',
      JSON.stringify({
        type: 'rent',
        tax: body.tax,
        currency: body.currency,
        frequency: body.frequency,
        description: body.description,
        properties: body.properties,
        phone: `+${body.phone.code}${body.phone.phone}`,
        whatsapp: body.whatsapp,
      }),
    );

    body.images.forEach((image) => {
      formData.append('images', image.blob);
    });

    console.log(map);
    console.log(body.images);

    formData.append('map', JSON.stringify(map));

    const data = await $fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      body: formData,
      headers: {
        Authorization: `Bearer ${useCookie('access_token').value}`,
      },
    });

    return { postId: data.postId };
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 401 && error.data.message === 'The access token has expired') {
        throw new AccessTokenExpiredError(error.message);
      }
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters')
          throw new BadRequestError(error.message);
        if (
          error.data.message === 'File exceeds the maximum allowed size of 5MB' &&
          'data' in error.data &&
          'index' in error.data.data
        )
          throw new MaxImageSizeError(error.message, error.data.data.index);
        if (error.data.message === 'Invalid or missing access token') throw new FatalError();
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError();
  }
}

async function updateExchange(
  body: UpdateExchangeSchema,
  id: string,
  map: {
    new: number[];
    removed: number[];
  },
) {
  try {
    const formData = new FormData();
    formData.append(
      'input',
      JSON.stringify({
        type: 'exchange',
        offers: body.offers,
        needs: body.needs,
        description: body.description,
        properties: body.properties,
        phone: `+${body.phone.code}${body.phone.phone}`,
        whatsapp: body.whatsapp,
      }),
    );

    body.images.forEach((image) => {
      formData.append('images', image.blob);
    });

    formData.append('map', JSON.stringify(map));

    const data = await $fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      body: formData,
      headers: {
        Authorization: `Bearer ${useCookie('access_token').value}`,
      },
    });

    return { postId: data.postId };
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.statusCode === 401 && error.data.message === 'The access token has expired') {
        throw new AccessTokenExpiredError(error.message);
      }
      if (error.status === 400) {
        if (error.data.message === 'Invalid or missing required parameters')
          throw new BadRequestError(error.message);
        if (
          error.data.message === 'File exceeds the maximum allowed size of 5MB' &&
          'data' in error.data &&
          'index' in error.data.data
        )
          throw new MaxImageSizeError(error.message, error.data.data.index);
        if (error.data.message === 'Invalid or missing access token') throw new FatalError();
        throw new BadRequestError(error.message);
      }
    }
    throw new FatalError();
  }
}

export default function () {
  return {
    updateAgent,
    updateSale,
    updateRent,
    updateExchange,
    parsePhone,
  };
}
