import type {
  Agent as AgentDB,
  Client as ClientDB,
  User as UserDB,
  Avatar as AvatarDB,
} from '@prisma/client';

export type UserInstance = { agent: (AgentDB & { avatar: AvatarDB | null }) | null } & {
  client: ClientDB | null;
} & UserDB;

export type UserTransformer =
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
