import fs from 'fs';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import type {
  ClientRegisterData,
  AgentRegisterData,
  UserLoginData,
  AgentUpdateData,
} from '~/server/models/ValSchema';

import {
  ConflictError,
  VerificationTokenError,
  VerifiedError,
  NotFoundError,
  CredentialsError,
  RefreshTokenError,
  PasswordCodeError,
} from '../models/Error';
import { UAParser } from 'ua-parser-js';

type AvatarData = {
  path: string;
  url: string;
};

const prisma = new PrismaClient();

export function registerClient(clientData: ClientRegisterData) {
  return prisma.$transaction(async (tx) => {
    const founded = await tx.user.findUnique({
      where: { email: clientData.email },
    });

    if (founded) {
      if (founded.verified) throw new ConflictError('User exists already');
      else {
        const deleted = await tx.user.delete({
          where: { email: founded.email },
          include: {
            agent: {
              include: {
                avatar: true,
              },
            },
          },
        });

        const created = await tx.user.create({
          data: {
            type: 'client',
            email: clientData.email,
            password: bcrypt.hashSync(clientData.password, 10),
            client: {
              create: {},
            },
            verificationCode: {
              create: { code: crypto.randomUUID() },
            },
          },
          include: {
            verificationCode: true,
            client: true,
          },
        });

        // Delete the old avatar if deleted was an agent
        try {
          if (deleted.agent?.avatar?.path) fs.unlinkSync(deleted.agent?.avatar?.path);
        } catch (error) {
          console.error('An error has ocurred while deleting an avatar\n', error);
        }

        return created;
      }
    }

    const created = await tx.user.create({
      data: {
        type: 'client',
        email: clientData.email,
        password: bcrypt.hashSync(clientData.password, 10),
        client: {
          create: {},
        },
        verificationCode: {
          create: { code: crypto.randomUUID() },
        },
      },
      include: {
        verificationCode: true,
        client: true,
      },
    });
    return created;
  });
}

export function registerAgent(agentData: AgentRegisterData, avatarData: AvatarData) {
  return prisma.$transaction(async (tx) => {
    const founded = await tx.user.findUnique({
      where: { email: agentData.email },
    });

    if (founded) {
      if (founded.verified) throw new ConflictError('User exists already');
      else {
        const deleted = await tx.user.delete({
          where: { email: founded.email },
          include: {
            agent: {
              include: {
                avatar: true,
              },
            },
          },
        });

        const created = await tx.user.create({
          data: {
            type: 'agent',
            email: agentData.email,
            password: bcrypt.hashSync(agentData.password, 10),
            agent: {
              create: {
                firstname: agentData.firstname,
                lastname: agentData.lastname,
                phone: agentData.phone,
                bio: agentData.bio,
                avatar: {
                  create: {
                    path: `${avatarData.path}`,
                    url: `${avatarData.url}`,
                  },
                },
              },
            },
            verificationCode: {
              create: { code: crypto.randomUUID() },
            },
          },
          include: {
            verificationCode: true,
            agent: true,
          },
        });

        // Delete the old avatar if deleted was an agent
        try {
          if (deleted.agent?.avatar?.path) fs.unlinkSync(deleted.agent?.avatar?.path);
        } catch (error) {
          console.error(error);
        }

        return created;
      }
    }

    const created = await tx.user.create({
      data: {
        type: 'agent',
        email: agentData.email,
        password: bcrypt.hashSync(agentData.password, 10),
        agent: {
          create: {
            firstname: agentData.firstname,
            lastname: agentData.lastname,
            phone: agentData.phone,
            bio: agentData.bio,
            avatar: {
              create: {
                path: `${avatarData.path}`,
                url: `${avatarData.url}`,
              },
            },
          },
        },
        verificationCode: {
          create: { code: crypto.randomUUID() },
        },
      },
      include: {
        verificationCode: true,
        agent: true,
      },
    });
    return created;
  });
}

export function verifyUser(id: string, code: string) {
  return prisma.$transaction(async (tx) => {
    // Find the user and the verification code
    const founded = await tx.user.findUniqueOrThrow({
      where: { id },
      include: {
        verificationCode: true,
      },
    });

    // Validate if user its not yet verified
    if (founded.verified) throw new VerifiedError('This account is verified already');

    // Validate the verification code
    if (founded.verificationCode?.code !== code)
      throw new VerificationTokenError('Invalid verification token');

    // Update the user
    await tx.user.update({
      where: { id },
      data: {
        verified: true,
        verificationCode: {
          delete: true,
        },
      },
    });
  });
}

export function resetVerificationCode(email: string) {
  return prisma.$transaction(async (tx) => {
    // Find the user by email
    const user = await tx.user.findUnique({
      where: { email },
    });

    if (!user) throw new NotFoundError('User not found');

    if (user.verified) throw new VerifiedError('This account is verified already');

    const verificationCode = await tx.verificationCode.update({
      where: { userId: user.id },
      data: { code: crypto.randomUUID() },
    });

    return { user, verificationCode };
  });
}

export function loginUser(userData: UserLoginData, ua: string | undefined) {
  return prisma.$transaction(async (tx) => {
    // Find the verified user by email
    const user = await tx.user.findUnique({
      where: { email: userData.email, verified: true },
      include: {
        client: true,
        agent: {
          include: {
            avatar: true,
          },
        },
      },
    });

    if (!user) throw new CredentialsError('User not founded');

    // Compare passwords
    const passwordMatch = await bcrypt.compare(userData.password, user.password);
    if (!passwordMatch) throw new CredentialsError('Wrong password');

    // Get and parse the user-agent
    const parsedUA = UAParser(ua);

    // Create the session
    const session = await tx.session.create({
      data: {
        code: crypto.randomUUID(),
        browser: parsedUA.browser.name,
        os: parsedUA.os.name,
        cpu: parsedUA.cpu.architecture,
        userId: user.id,
      },
    });

    return { user, session };
  });
}

export function refreshSession(id: string, code: string) {
  return prisma.$transaction(async (tx) => {
    // Find the session by id
    const prevSession = await tx.session.findUnique({ where: { id } });

    if (!prevSession) throw new RefreshTokenError('Session not founded');

    // Validate the session
    if (prevSession.code !== code) throw new RefreshTokenError('Wrong code');

    // Update the session code
    const session = await tx.session.update({
      where: { id: prevSession.id },
      data: { code: crypto.randomUUID() },
    });

    // Find the user by id
    const user = await tx.user.findUniqueOrThrow({
      where: { id: session.userId },
      include: {
        client: true,
        agent: {
          include: {
            avatar: true,
          },
        },
      },
    });

    return { user, session };
  });
}

export async function findUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id, verified: true },
    include: {
      client: true,
      agent: {
        include: {
          avatar: true,
        },
      },
    },
  });

  if (!user) throw new NotFoundError('User not found');

  return user;
}

export function logoutUser(id: string, code: string) {
  return prisma.$transaction(async (tx) => {
    // Find the session by id
    const session = await tx.session.findUnique({ where: { id } });

    if (!session) throw new RefreshTokenError('Session not founded');

    // Validate the session
    if (session.code !== code) throw new RefreshTokenError('Wrong code');

    // Delete the session
    await tx.session.delete({ where: { id } });
  });
}

export async function updateAgent(
  id: string,
  agentData: AgentUpdateData,
  avatarData: AvatarData | undefined = undefined,
) {
  const user = await prisma.user
    .update({
      where: { id, verified: true, type: 'agent' },
      data: {
        agent: {
          update: {
            firstname: agentData.firstname,
            lastname: agentData.lastname,
            bio:
              agentData.bio !== undefined
                ? agentData.bio.length > 0
                  ? agentData.bio
                  : { unset: true }
                : undefined,
            phone: agentData.phone,
            avatar: {
              update: {
                path: avatarData?.path,
                url: avatarData?.url,
              },
            },
          },
        },
      },
      include: {
        client: true,
        agent: {
          include: {
            avatar: true,
          },
        },
      },
    })
    .catch((error) => {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')
        throw new NotFoundError('User not found');

      throw error;
    });

  return { user, avatarWasUpdated: !!avatarData };
}

export function upsertPasswordCode(email: string) {
  return prisma.$transaction(async (tx) => {
    // Find the verified user by email
    const user = await tx.user.findUnique({
      where: { email, verified: true },
    });

    if (!user) throw new NotFoundError('User not found');

    // Create or update the password code by user id
    const code = (Math.floor(Math.random() * 900000) + 100000).toString();

    const passwordCode = await tx.passwordCode.upsert({
      where: { userId: user.id },
      update: { code },
      create: { code, userId: user.id },
    });

    return { user, passwordCode };
  });
}

export function deletePasswordCode(id: string, timeout: number) {
  return new Promise<true>((resolve) => {
    setTimeout(async () => {
      await prisma.passwordCode
        .delete({
          where: { id },
        })
        .then(() => resolve(true))
        .catch((error) => console.error(error));
    }, timeout);
  });
}

export function validatePasswordCode(passwordCodeData: { email: string; code: string }) {
  return prisma.$transaction(async (tx) => {
    // Find the verified user by email
    const user = await tx.user.findUnique({
      where: { email: passwordCodeData.email, verified: true },
    });

    if (!user) throw new PasswordCodeError('User not founded');

    // Find the password code by user id
    const passwordCode = await tx.passwordCode.findUnique({
      where: { userId: user.id },
    });

    if (!passwordCode) throw new PasswordCodeError('Password code not founded');

    // Validate the password codes
    if (passwordCode.code !== passwordCodeData.code) throw new PasswordCodeError('Wrong code');

    // Set password pending and delete password code
    const newUser = tx.user.update({
      where: { id: user.id },
      data: {
        passwordPending: true,
        passwordCode: { delete: true },
      },
    });

    return newUser;
  });
}

export function unsetPendingPassword(id: string, timeout: number) {
  return new Promise<true>((resolve) => {
    setTimeout(async () => {
      await prisma.user
        .update({
          where: { id },
          data: {
            passwordPending: { unset: true },
          },
        })
        .then(() => resolve(true))
        .catch((error) => console.error(error));
    }, timeout);
  });
}

export async function updatePassword(email: string, password: string) {
  const hash = bcrypt.hashSync(password, 10);

  await prisma.user
    .update({
      where: { email, verified: true, passwordPending: true },
      data: {
        password: hash,
        passwordPending: { unset: true },
      },
    })
    .catch((error) => {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundError('User not found');
      }

      throw error;
    });
}
