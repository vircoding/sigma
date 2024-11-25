import type {
  Agent as AgentDB,
  Client as ClientDB,
  User as UserDB,
  Avatar as AvatarDB,
} from '@prisma/client';
import { UnexpectedError } from '../models/Error';

type UserInput = { agent: (AgentDB & { avatar: AvatarDB | null }) | null } & {
  client: ClientDB | null;
} & UserDB;

type UserData =
  | {
      type: 'client';
      id: string;
    }
  | {
      type: 'agent';
      avatar: string;
      firstname: string;
      lastname: string;
      phone: string;
      bio: string;
      id: string;
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
