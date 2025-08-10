import { UnexpectedError } from '~~/server/classes/Error';

export function userTransformer(u: UserInstance): User {
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

export function searchResultTransformer(u: SearchResultInstance[]): SearchResult[] {
  const result: SearchResult[] = [];

  u.forEach((post) => {
    if (post.type === 'sale' && post.sale) {
      result.push({
        type: 'sale',
        id: post.id,
        details: {
          amount: post.sale.amount,
          currency: post.sale.currency,
        },
        description: post.description || '',
        contact: {
          whatsapp: post.whatsapp,
          phone: post.phone,
        },
        images: post.images.map((item) => item.url),
        properties: post.properties.map((item) => ({
          address: {
            province: item.address.province as PROVINCES,
            municipality: item.address.municipality,
          },
          features: {
            bed: item.features.bed,
            bath: item.features.bath,
            backyard: item.features.backyard,
            balcony: item.features.balcony,
            garage: item.features.garage,
            pool: item.features.pool,
          },
        })),
      });
    } else if (post.type === 'rent' && post.rent) {
      result.push({
        type: 'rent',
        id: post.id,
        details: {
          tax: post.rent.tax,
          currency: post.rent.currency,
          frequency: post.rent.frequency,
        },
        description: post.description || '',
        contact: {
          whatsapp: post.whatsapp,
          phone: post.phone,
        },
        images: post.images.map((item) => item.url),
        properties: post.properties.map((item) => ({
          address: {
            province: item.address.province as PROVINCES,
            municipality: item.address.municipality,
          },
          features: {
            bed: item.features.bed,
            bath: item.features.bath,
            backyard: item.features.backyard,
            balcony: item.features.balcony,
            garage: item.features.garage,
            pool: item.features.pool,
          },
        })),
      });
    } else if (post.type === 'exchange' && post.exchange) {
      result.push({
        type: 'exchange',
        id: post.id,
        details: {
          needs: post.exchange.needs,
          offers: post.exchange.offers,
        },
        description: post.description || '',
        contact: {
          whatsapp: post.whatsapp,
          phone: post.phone,
        },
        images: post.images.map((item) => item.url),
        properties: post.properties.map((item) => ({
          address: {
            province: item.address.province as PROVINCES,
            municipality: item.address.municipality,
          },
          features: {
            bed: item.features.bed,
            bath: item.features.bath,
            backyard: item.features.backyard,
            balcony: item.features.balcony,
            garage: item.features.garage,
            pool: item.features.pool,
          },
        })),
      });
    } else throw new UnexpectedError();
  });

  return result;
}

export function postTransformer(u: PostInstance): Post {
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
          backyard: item.features.backyard,
          balcony: item.features.balcony,
          garage: item.features.garage,
          pool: item.features.pool,
        },
      })),
    };
  } else if (u.type === 'rent' && u.rent) {
    return {
      type: 'rent',
      id: u.id,
      details: {
        tax: u.rent.tax,
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
          backyard: item.features.backyard,
          balcony: item.features.balcony,
          garage: item.features.garage,
          pool: item.features.pool,
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
          backyard: item.features.backyard,
          balcony: item.features.balcony,
          garage: item.features.garage,
          pool: item.features.pool,
        },
      })),
    };
  } else throw new UnexpectedError();
}

export function userPostsTransformer(list: UserPostInstance[]): UserPost[] {
  return list.map((u) => {
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
        properties: u.properties.map((item) => ({
          address: {
            province: item.address.province as PROVINCES,
            municipality: item.address.municipality,
          },
          features: {
            bed: item.features.bed,
            bath: item.features.bath,
            backyard: item.features.backyard,
            balcony: item.features.balcony,
            garage: item.features.garage,
            pool: item.features.pool,
          },
        })),
      };
    } else if (u.type === 'rent' && u.rent) {
      return {
        type: 'rent',
        id: u.id,
        details: {
          tax: u.rent.tax,
          currency: u.rent.currency,
          frequency: u.rent.frequency,
        },
        description: u.description || '',
        contact: {
          whatsapp: u.whatsapp,
          phone: u.phone,
        },
        properties: u.properties.map((item) => ({
          address: {
            province: item.address.province as PROVINCES,
            municipality: item.address.municipality,
          },
          features: {
            bed: item.features.bed,
            bath: item.features.bath,
            backyard: item.features.backyard,
            balcony: item.features.balcony,
            garage: item.features.garage,
            pool: item.features.pool,
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
        properties: u.properties.map((item) => ({
          address: {
            province: item.address.province as PROVINCES,
            municipality: item.address.municipality,
          },
          features: {
            bed: item.features.bed,
            bath: item.features.bath,
            backyard: item.features.backyard,
            balcony: item.features.balcony,
            garage: item.features.garage,
            pool: item.features.pool,
          },
        })),
      };
    } else throw new UnexpectedError();
  });
}
