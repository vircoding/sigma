import type { UserInstance } from '~/models/types/User';
import type {
  Currency as CurrencyDB,
  Post as PostDB,
  Sale as SaleDB,
  Rent as RentDB,
  Exchange as ExchangeDB,
  Property as PropertyDB,
  Image as ImageDB,
  Frequency as FrequencyDB,
  PostType as PostTypeDB,
} from '@prisma/client';

export type Frequency = FrequencyDB;
export type Currency = CurrencyDB;
export type PostType = PostTypeDB;

type Address = {
  province: PROVINCES;
  municipality: string;
};

export type Features = {
  bed: number;
  bath: number;
  garage: boolean;
  garden: boolean;
  pool: boolean;
  furnished: boolean;
};

type FeaturesInput = {
  bed: string;
  bath: string;
  garage: boolean;
  garden: boolean;
  pool: boolean;
  furnished: boolean;
};

export type Property = {
  address: Address;
  features: Features;
};

type PropertyInput = {
  address: Address;
  features: FeaturesInput;
};

export type Image = {
  imageURL: string;
  blob: Blob;
};

export type Offers = 1 | 2 | 3;
export type Needs = 0 | 1 | 2 | 3;

export type Code = {
  code: string;
  esName: string;
  enName: string;
  callingCode: string;
};

export type InsertInput = {
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
  properties: PropertyInput[];
  images: Image[];
  description: string;
};

export type SaleDetails = {
  amount: number;
  currency: Currency;
};

export type RentDetails = {
  tax: number;
  currency: Currency;
  frequency: Frequency;
};

export type ExchangeDetails = {
  needs: number;
  offers: number;
};

export type Details = SaleDetails | RentDetails | ExchangeDetails;

type Author = {
  authorId: string;
  agent?: {
    firstname: string;
    lastname: string;
    avatar: string;
    email: string;
  };
};

type Contact = {
  whatsapp: boolean;
  phone: string;
};

export type Post = {
  id: string;
  description: string;
  contact: Contact;
  images: string[];
  author: Author;
  properties: Property[];
} & (
  | {
      type: 'sale';
      details: SaleDetails;
    }
  | {
      type: 'rent';
      details: RentDetails;
    }
  | {
      type: 'exchange';
      details: ExchangeDetails;
    }
);

export type PostInstance = PostDB & {
  properties: PropertyDB[];
  images: ImageDB[];
  sale: SaleDB | null;
  rent: RentDB | null;
  exchange: ExchangeDB | null;
  user: UserInstance | null;
};

export enum PROVINCES {
  'Pinar del Río' = 'Pinar del Río',
  'Artemisa' = 'Artemisa',
  'La Habana' = 'La Habana',
  'Mayabeque' = 'Mayabeque',
  'Matanzas' = 'Matanzas',
  'Villa Clara' = 'Villa Clara',
  'Cienfuegos' = 'Cienfuegos',
  'Sancti Spíritus' = 'Sancti Spíritus',
  'Ciego de Ávila' = 'Ciego de Ávila',
  'Camagüey' = 'Camagüey',
  'Las Tunas' = 'Las Tunas',
  'Holguín' = 'Holguín',
  'Granma' = 'Granma',
  'Santiago de Cuba' = 'Santiago de Cuba',
  'Guantánamo' = 'Guantánamo',
  'Isla de la Juventud' = 'Isla de la Juventud',
}
