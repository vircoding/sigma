import type { PostData, PROVINCES, UserData } from '~/server/models/Types';
import type {
  Agent as AgentDB,
  Client as ClientDB,
  User as UserDB,
  Avatar as AvatarDB,
  Post as PostDB,
  Sale as SaleDB,
  Rent as RentDB,
  Exchange as ExchangeDB,
  Property as PropertyDB,
  Image as ImageDB,
} from '@prisma/client';
import { UnexpectedError } from '../models/Error';

type UserInput = { agent: (AgentDB & { avatar: AvatarDB | null }) | null } & {
  client: ClientDB | null;
} & UserDB;

type PostInput = PostDB & {
  properties: PropertyDB[];
  images: ImageDB[];
  sale: SaleDB | null;
  rent: RentDB | null;
  exchange: ExchangeDB | null;
  user: UserInput | null;
};

export function userTransformer(u: UserInput): UserData {
  if (u.type === 'client') {
    return {
      id: u.id,
      type: 'client',
    };
  } else if (u.type === 'agent' && u.agent && u.agent.avatar) {
    return {
      id: u.id,
      type: 'agent',
      firstname: u.agent.firstname,
      lastname: u.agent.lastname,
      avatar: u.agent.avatar.url,
      phone: u.agent.phone,
      bio: u.agent.bio || '',
    };
  } else throw new UnexpectedError();
}

export function postTransformer(u: PostInput): PostData {
  if (u.type === 'sale' && u.sale) {
    return {
      type: 'sale',
      id: u.id,
      details: {
        amount: u.sale.amount,
        currency: u.sale.currency,
      },
      description: u.description || '',
      contact: {
        whatsapp: u.whatsapp,
        phone: u.phone,
      },
      images: u.images.map((item) => item.url),
      author: {
        authorId: u.userId,
        agent:
          u.user?.type === 'agent' && u.user.agent && u.user.agent.avatar
            ? {
                firstname: u.user.agent.firstname,
                lastname: u.user.agent.lastname,
                avatar: u.user.agent.avatar.url,
                email: u.user.email,
              }
            : undefined,
      },
      properties: u.properties.map((item) => ({
        address: {
          province: item.address.province as PROVINCES,
          municipality: item.address.municipality,
        },
        features: {
          bed: item.features.bed,
          bath: item.features.bath,
          garage: item.features.garage,
          garden: item.features.garden,
          pool: item.features.pool,
          furnished: item.features.furnished,
        },
      })),
    };
  } else if (u.type === 'rent' && u.rent) {
    return {
      type: 'rent',
      id: u.id,
      details: {
        tax: u.rent.amount,
        currency: u.rent.currency,
        frequency: u.rent.frequency,
      },
      description: u.description || '',
      contact: {
        whatsapp: u.whatsapp,
        phone: u.phone,
      },
      images: u.images.map((item) => item.url),
      author: {
        authorId: u.userId,
        agent:
          u.user?.type === 'agent' && u.user.agent && u.user.agent.avatar
            ? {
                firstname: u.user.agent.firstname,
                lastname: u.user.agent.lastname,
                avatar: u.user.agent.avatar.url,
                email: u.user.email,
              }
            : undefined,
      },
      properties: u.properties.map((item) => ({
        address: {
          province: item.address.province as PROVINCES,
          municipality: item.address.municipality,
        },
        features: {
          bed: item.features.bed,
          bath: item.features.bath,
          garage: item.features.garage,
          garden: item.features.garden,
          pool: item.features.pool,
          furnished: item.features.furnished,
        },
      })),
    };
  } else if (u.type === 'exchange' && u.exchange) {
    return {
      type: 'exchange',
      id: u.id,
      details: {
        needs: u.exchange.needs,
        offers: u.exchange.offers,
      },
      description: u.description || '',
      contact: {
        whatsapp: u.whatsapp,
        phone: u.phone,
      },
      images: u.images.map((item) => item.url),
      author: {
        authorId: u.userId,
        agent:
          u.user?.type === 'agent' && u.user.agent && u.user.agent.avatar
            ? {
                firstname: u.user.agent.firstname,
                lastname: u.user.agent.lastname,
                avatar: u.user.agent.avatar.url,
                email: u.user.email,
              }
            : undefined,
      },
      properties: u.properties.map((item) => ({
        address: {
          province: item.address.province as PROVINCES,
          municipality: item.address.municipality,
        },
        features: {
          bed: item.features.bed,
          bath: item.features.bath,
          garage: item.features.garage,
          garden: item.features.garden,
          pool: item.features.pool,
          furnished: item.features.furnished,
        },
      })),
    };
  } else throw new UnexpectedError();
}
