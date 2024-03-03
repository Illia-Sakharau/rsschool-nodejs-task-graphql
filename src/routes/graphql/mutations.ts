import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { CreatePostInput, ChangePostInput, PostType } from "./types/post.js";
import { PrismaClient, Post, User, Profile } from "@prisma/client";
import { UUIDType } from "./types/uuid.js";
import { CreateUserInput, ChangeUserInput, UserType } from "./types/user.js";
import { CreateProfileInput, ChangeProfileInput, ProfileType } from "./types/profile.js";

export const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // post
    createPost: {
      type: PostType,
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: async (_source, args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { dto } = args as { dto: Omit<Post, 'id'> }
        return await prisma.post.create({
          data: dto,
        });
      }
    },
    changePost: {
      type: PostType,
      args: { 
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) }
      },
      resolve: async (_source, args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { id, dto } = args as { id: string, dto: Omit<Post, 'id'> }
        return await prisma.post.update({
          where: { id },
          data: dto,
        });
      }
    },
    deletePost: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source, args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { id } = args as { id: string }
        return !!(await prisma.post.delete({
          where: { id },
        }));
      }
    },
    // user
    createUser: {
      type: UserType,
      args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
      resolve: async (_source, args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { dto } = args as { dto: Omit<User, 'id'> }
        return await prisma.user.create({
          data: dto,
        });
      }
    },
    changeUser: {
      type: UserType,
      args: { 
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) }
      },
      resolve: async (_source, args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { id, dto } = args as { id: string, dto: Omit<User, 'id'> }
        return await prisma.user.update({
          where: { id },
          data: dto,
        });
      }
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source, args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { id } = args as { id: string }
        return !!(await prisma.user.delete({
          where: { id },
        }));
      }
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { userId, authorId } = args as { userId: string, authorId: string }
        return await prisma.user.update({
          where: { id: userId },
          data: {
            userSubscribedTo: {
              create: {
                authorId
              }
            }
          },
        });
      }
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { userId, authorId } = args as { userId: string, authorId: string }
        return !!(await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId
            }
          },
        }));
      }
    },
    // profile
    createProfile: {
      type: ProfileType,
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: async (_source, args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { dto } = args as { dto: Omit<Profile, 'id'> }
        return await prisma.profile.create({
          data: dto,
        });
      }
    },
    changeProfile: {
      type: ProfileType,
      args: { 
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) }
      },
      resolve: async (_source, args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { id, dto } = args as { id: string, dto: Omit<Profile, 'id'> }
        return await prisma.profile.update({
          where: { id },
          data: dto,
        });
      }
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source, args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { id } = args as { id: string }
        return !!(await prisma.profile.delete({
          where: { id },
        }));
      }
    }
  }
})