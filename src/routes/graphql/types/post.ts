import { GraphQLInputObjectType, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";


export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  })
})

const PostInputsFields = {
  title: { type: GraphQLString },
  content: { type: GraphQLString },
  authorId: { type: UUIDType },
}

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: PostInputsFields,
})

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: PostInputsFields,
})
