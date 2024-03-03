import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLObjectType } from "graphql"
import { UUIDType } from "./uuid.js";
import { MemberTypeId, MemberTypeType } from "./memberType.js";
import { PrismaClient } from "@prisma/client";

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
    memberType: { 
      type: MemberTypeType,
      resolve: async (source, _args, context) => {
        const { prisma } = context as { prisma: PrismaClient };
        const { memberTypeId } = source as { memberTypeId: string }
        return await prisma.memberType.findUnique({
          where: { id: memberTypeId },
        });
      }
    },
  })
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
  },
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeId },
  },
});
