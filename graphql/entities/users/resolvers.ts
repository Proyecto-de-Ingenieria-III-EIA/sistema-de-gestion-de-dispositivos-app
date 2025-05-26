import { AuthData, Resolver } from '@/types';
import { Enum_RoleName, PrismaClient, Role, User } from '@prisma/client';
import { GraphQLError } from 'graphql';

interface UserByEmailInput {
  email: string;
}

const userResolvers: Resolver = {
  User: {
    sessions: async (parent: User, args, { db }) => {
      return await db.session.findMany({
        where: {
          userId: parent.id,
        },
      });
    },
    role: async (parent: User, args, { db }) => {
      const role = (await db.$queryRaw`
      select r.* from "Role" r
        join "User" u
            on u."roleId" = r.id
      where u.id = ${parent.id}
        `) as Role[];

      return role[0];
    },
  },
  Query: {
    getUsers: async (parent, args, { db, authData }) => {
      if (authData.role !== Enum_RoleName.ADMIN) {
        throw new GraphQLError('Not authorized. Admin role required.');
      }
      return await db.user.findMany();
    },
    getUserByEmail: async (
      parent,
      args: UserByEmailInput,
      { db, authData}: { db: PrismaClient; authData: AuthData },
    ) => {
      // console.log(authData);
      if (authData.role !== Enum_RoleName.ADMIN) {
        throw new GraphQLError('Not authorized. Admin or User role required.');
      }
      return await db.user.findUnique({
        where: {
          email: args.email,
        },
      });
    },
  },

  Mutation: {
    updateUserRole: async (parent, args, { db, authData }) => {
      if (authData.role !== Enum_RoleName.ADMIN) {
        throw new GraphQLError('Not authorized. Admin role required.');
      }

      const role = await db.role.findFirst({
        where: {
          name: args.roleName,
        },
      });

      if (!role) {
        throw new GraphQLError('Role not found.');
      }

      return db.user.update({
        where: {
          id: args.id,
        },
        data: {
          roleId: role.id,
        },
        include: {
          role: true
        }
      });  
    },
    updateUserRoleByEmail: async (parent, args, { db, authData }) => {
      if (authData.role !== Enum_RoleName.ADMIN) {
        throw new GraphQLError('Not authorized. Admin role required.');
      }
      const role = await db.role.findFirst({
        where: {
          name: args.name,
        },
      });
      if (!role) {
        throw new GraphQLError('Role not found.');
      }
      if(authData.email === args.email) {
        throw new GraphQLError('You cannot change your own role.');
      }
      return db.user.update({
        where: {
          email: args.email,
        },
        data: {
          roleId: role?.id ?? '',
        },
      });
    },
  },
};

export { userResolvers };
