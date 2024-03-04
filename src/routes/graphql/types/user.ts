import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"
import { UUIDType } from "./uuid.js";
import { ProfileType } from "./profile.js";
import { PostType } from "./post.js";
import { LoadersType } from "../loaders.js";

export const UserType: GraphQLObjectType  = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (source, _args, context) => {
        const { loaders } = context as { loaders: LoadersType };
        const { id: userId } = source as { id: string }
        return loaders.postsLoader.load(userId)
      }
    },
    profile: {
      type: ProfileType,
      resolve: async (source, _args, context) => {
        const { loaders } = context as { loaders: LoadersType };
        const { id: userId } = source as { id: string }
        return loaders.profilesLoader.load(userId)
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (source, _args, context) => {
        const { loaders } = context as { loaders: LoadersType };
        const { id: userId } = source as { id: string }
        return loaders.userSubscribedToLoader.load(userId)
      }
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (source, _args, context) => {
        const { loaders } = context as { loaders: LoadersType };
        const { id: userId } = source as { id: string }
        return loaders.subscribedToUserLoader.load(userId)
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
