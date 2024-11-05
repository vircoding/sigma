import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { ClientRegisterData, AgentRegisterData } from '~/server/models/ValSchema';
import { ConflictError } from '../models/Error';

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