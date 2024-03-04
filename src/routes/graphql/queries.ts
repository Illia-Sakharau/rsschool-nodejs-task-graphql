/* eslint-disable @typescript-eslint/no-unsafe-return */
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { MemberTypeId, MemberTypeType } from "./types/memberType.js";
import {
  ResolveTree,
  parseResolveInfo,
  simplify,
} from 'graphql-parse-resolve-info';
import { PrismaClient } from '@prisma/client';
import { PostType } from "./types/post.js";
import { UUIDType } from "./types/uuid.js";
import { UserType } from "./types/user.js";
import { ProfileType } from "./types/profile.js";
import { LoadersType } from "./loaders.js";


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
      resolve: async (_source, _args, context, info) => {
        const { prisma, loaders } = context as { prisma: PrismaClient, loaders: LoadersType };
        const { fields } = simplify((parseResolveInfo(info) as ResolveTree), UserType);
        const hasAuthors = 'subscribedToUser' in fields;
        const hasSubs = 'userSubscribedTo' in fields;

        const users = await prisma.user.findMany({
          include: {
            subscribedToUser: hasAuthors,
            userSubscribedTo: hasSubs,
          }
        })

        if (hasAuthors || hasSubs) {
          const usersMap = users.reduce((map, user) => {
            return { ...map, [user.id]: user }
          }, {});

          users.forEach((user) => {
            if (hasSubs) {
              loaders.userSubscribedToLoader.prime(
                user.id,
                user.userSubscribedTo.map(({ authorId }) => usersMap[authorId]),
              )
            }
            if (hasAuthors) {
              loaders.subscribedToUserLoader.prime(
                user.id,
                user.subscribedToUser.map(({ subscriberId }) => usersMap[subscriberId]),
              )
            }
          })
        }

        return users
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
