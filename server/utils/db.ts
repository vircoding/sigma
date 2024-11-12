import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type {
  ClientRegisterData,
  AgentRegisterData,
  UserLoginData,
} from '~/server/models/ValSchema';

import {
  ConflictError,
  VerificationTokenError,
  VerifiedError,
  NotFoundError,
  CredentialsError,
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
