import type { UserInstance } from '~/types/user';
import type {
  Post as PostDB,
  Sale as SaleDB,
  Rent as RentDB,
  Exchange as ExchangeDB,
  Property as PropertyDB,
  Image as ImageDB,
} from '@prisma/client';

export enum POST {
  'sale' = 'sale',
  'rent' = 'rent',
  'exchange' = 'exchange',
}

type Address = {
  province: PROVINCES;
  municipality: string;
};

type Features = {
  bed: number;
  bath: number;
  garage: boolean;
  garden: boolean;
  pool: boolean;
  furnished: boolean;
};

type Property = {
  address: Address;
  features: Features;
};

type SaleDetails = {
  amount: number;
  currency: 'USD' | 'CUP';
};

type RentDetails = {
  tax: number;
  currency: 'USD' | 'CUP';
  frequency: 'daily' | 'monthly';
};

type ExchangeDetails = {
  needs: number;
  offers: number;
};

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

export type PostTransformer = {
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
