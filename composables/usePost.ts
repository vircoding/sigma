import { FetchError } from 'ofetch';
import type {
  InsertSaleFormSchema,
  InsertRentFormSchema,
  InsertExchangeFormSchema,
} from '~/models/ValSchema';
import {
  AccessTokenExpiredError,
  AgentMaxError,
  BadRequestError,
  ClientMaxError,
  FatalError,
  MaxImageSizeError,
} from '~/models/Error';

function getInputByType(
  body: InsertSaleFormSchema | InsertRentFormSchema | InsertExchangeFormSchema,
) {
  switch (body.type) {
    case 'rent':
      return JSON.stringify({
        type: body.type,
        amount: body.rentTax,
        currency: body.rentCurrency,
        frequency: body.rentFrequency,
        description: body.description,
        properties: body.properties,
        phone: `+${body.phone.code}${body.phone.phone}`,
        whatsapp: body.whatsapp,
      });
    case 'exchange':
      return JSON.stringify({
        type: body.type,
        offers: body.exchangeOffers,
        needs: body.exchangeNeeds,
        description: body.description,
        properties: body.properties,
        phone: `+${body.phone.code}${body.phone.phone}`,
        whatsapp: body.whatsapp,
      });
    default:
      return JSON.stringify({
        type: body.type,
        amount: body.saleAmount,
        currency: body.saleCurrency,
        description: body.description,
        properties: body.properties,
        phone: `+${body.phone.code}${body.phone.phone}`,
        whatsapp: body.whatsapp,
      });
  }
}

async function insert(
  body: InsertSaleFormSchema | InsertRentFormSchema | InsertExchangeFormSchema,
) {
  try {
    const formData = new FormData();
    formData.append('input', getInputByType(body));

    body.images.forEach((image) => {
      formData.append('images', image.blob);
    });

    const data = await $fetch('/api/posts', {
      method: 'POST',
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
      if (error.status === 403) {
        if (error.data.message === 'Clients are limited to a maximum of 1 post')
          throw new ClientMaxError(error.message);
        if (error.data.message === 'Agents are limited to a maximum of 35 posts')
          throw new AgentMaxError(error.message);
      }
    }
    throw new FatalError();
  }
}

function formatAmount(amount: number, withSuffix: boolean = false) {
  const stringAmount = amount.toString();
  const length = stringAmount.length;

  if (length >= 7 && withSuffix) {
    const prefix = stringAmount.slice(0, -6);
    const suffix = prefix === '1' ? 'millón' : 'mill.';
    return `${prefix} ${suffix}`;
  }

  if (length >= 5) {
    return new Intl.NumberFormat().format(amount);
  }

  return stringAmount;
}

export default function () {
  return {
    insert,
    formatAmount,
  };
}
