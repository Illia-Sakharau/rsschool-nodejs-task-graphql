import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { MemberTypeId, MemberTypeType } from "./types/memberType.js";
import { PrismaClient } from '@prisma/client';
import { PostType } from "./types/post.js";
import { UUIDType } from "./types/uuid.js";
import { UserType } from "./types/user.js";
import { ProfileType } from "./types/profile.js";


export const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    // member type
    memberTypes: {
      type: new GraphQLList(MemberTypeType),
      resolve: async (_source, _args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        return await prisma.memberType.findMany()
      }
    },
    memberType: {
      type: MemberTypeType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (_source, args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { id } = args as { id: string }
        return await prisma.memberType.findUnique({
          where: {id},
        });
      }
    },

    //post
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_source, _args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        return await prisma.post.findMany()
      }
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { id } = args as { id: string }
        return await prisma.post.findUnique({
          where: {id},
        });
      }
    },

    //user
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_source, _args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        return await prisma.user.findMany()
      }
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { id } = args as { id: string }
        return await prisma.user.findUnique({
          where: {id},
        });
      }
    },

    //profile
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_source, _args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        return await prisma.profile.findMany()
      }
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { id } = args as { id: string }
        return await prisma.profile.findUnique({
          where: {id},
        });
      }
    },
  }
})
