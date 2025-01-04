import type {
  InsertSaleFormSchema,
  InsertRentFormSchema,
  InsertExchangeFormSchema,
} from '~/models/ValSchema';

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

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

export default function () {
  return {
    insert,
  };
}
