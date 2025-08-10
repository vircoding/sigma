import type {
  Agent as AgentDB,
  Client as ClientDB,
  User as UserDB,
  Avatar as AvatarDB,
} from '@prisma/client';

export type UserInstance = { agent: (AgentDB & { avatar: AvatarDB | null }) | null } & {
  client: ClientDB | null;
} & UserDB;

export type Client = {
  type: 'client';
  id: string;
};

export type Agent = {
  type: 'agent';
  avatar: string;
  firstname: string;
  lastname: string;
  phone: string;
  bio: string;
  id: string;
};

export type User = Client | Agent;

export type AvatarData = {
  path: string;
  url: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterClientInput = {
  email: string;
  password: string;
  repassword: string;
};

export type RegisterAgentInput = {
  email: string;
  password: string;
  repassword: string;
  firstname: string;
  lastname: string;
  phone: {
    phone: string;
    code: string;
  };
  bio: string;
  avatar?: Blob;
};

export type Avatar = {
  avatarURL: string;
  blob: Blob;
};

export type UpdateAgentInput = {
  firstname: string;
  lastname: string;
  phone: {
    phone: string;
    code: string;
  };
  bio: string;
  avatar?: Blob;
};
