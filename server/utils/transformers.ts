import type {
  Agent as AgentDB,
  Client as ClientDB,
  User as UserDB,
  Avatar as AvatarDB,
} from '@prisma/client';
import { UnexpectedError } from '../models/Error';

type UserData = { agent: (AgentDB & { avatar: AvatarDB | null }) | null } & {
  client: ClientDB | null;
} & UserDB;

export function userTransformer(u: UserData) {
  const r = {
    id: u.id,
    type: u.type,
    verified: u.verified,
  };

  if (u.agent && u.agent.avatar) {
    return {
      ...r,
      firstname: u.agent.firstname,
      lastname: u.agent.lastname,
      avatar: u.agent.avatar.url,
      phone: u.agent.phone,
      bio: u.agent.bio || 'Sin descripción',
    };
  } else throw new UnexpectedError();

  return r;
}
