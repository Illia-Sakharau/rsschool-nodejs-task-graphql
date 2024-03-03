import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit'

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const graphQlErrors = validate(schema, parse(query), [ depthLimit(5) ]);
      if (graphQlErrors.length) return { errors: graphQlErrors }
      return graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: {prisma},
      });
    },
  });
};

export default plugin;
