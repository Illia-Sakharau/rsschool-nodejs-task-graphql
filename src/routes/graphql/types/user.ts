import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"
import { UUIDType } from "./uuid.js";
import { ProfileType } from "./profile.js";
import { PrismaClient } from "@prisma/client";
import { PostType } from "./post.js";

export const UserType: GraphQLObjectType  = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (source, _args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { id: userId } = source as { id: string }
        return await prisma.post.findMany({
          where: { authorId: userId } 
        });
      }
    },
    profile: {
      type: ProfileType,
      resolve: async (source, _args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { id: userId } = source as { id: string }
        return await prisma.profile.findUnique({
          where: { userId },
        });
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (source, _args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { id: userId } = source as { id: string }
        return await prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: userId,
              },
            },
          },
        });
      }
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (source, _args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { id: userId } = source as { id: string }
        return await prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: userId,
              },
            },
          },
        });
      }
    }
  })
});

const UserInputFields  = {
  name: { type: GraphQLString },
  balance: { type: GraphQLFloat },
};

export const CreateUserInput  = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: UserInputFields,
});

export const ChangeUserInput  = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: UserInputFields,
});
