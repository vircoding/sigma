import type { PROVINCES } from '~/types/post';

export type PostType = 'sale' | 'rent' | 'exchange';

export type Property = {
  address: {
    province: PROVINCES;
    municipality: string;
  };
  features: {
    bed: string;
    bath: string;
    garage: boolean;
    garden: boolean;
    pool: boolean;
    furnished: boolean;
  };
};

export type Currency = 'USD' | 'CUP';

export type Frequency = 'daily' | 'monthly';

export type Offers = 1 | 2 | 3;

export type Needs = 0 | 1 | 2 | 3;

export type Insert = {
  type: PostType;
  sale: {
    amount: string;
    currency: Currency;
  };
  rent: {
    tax: string;
    currency: Currency;
    frequency: Frequency;
  };
  exchange: {
    offers: Offers;
    needs: Needs;
  };
  phone: {
    phone: string;
    code: string;
  };
  whatsapp: boolean;
  properties: Property[];
  images: Image[];
  description: string;
};

export type Code = {
  code: string;
  esName: string;
  enName: string;
  callingCode: string;
};

export type Image = {
  imageURL: string;
  blob: Blob;
};
