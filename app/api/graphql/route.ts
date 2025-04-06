import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { resolvers, types } from '@/graphql';
import { prisma } from '@/prisma';

// Create the executable schema
export const schema = makeExecutableSchema({ typeDefs: types, resolvers });

// Initialize the Apollo Server
const server = new ApolloServer({ schema });

// Build your context function to include email, role, etc.
async function buildContext(request: Request) {
  const token = request.headers.get('session-token');
  const authData = (await prisma.$queryRaw`
    select 
      u.email,
      r."name" as "role",
      s.expires
    from "Session" s
      join "User" u on s."userId" = u.id
      join "Role" r on u."roleId" = r.id
    where s."sessionToken" = ${token}
  `) as { email: string; role: string; expires: Date }[];

  return {
    db: prisma,
    authData: authData[0],
  };
}

// Create the Next.js handler using Apollo's integration
const handler = startServerAndCreateNextHandler(server, {
  context: async (req: Request) => await buildContext(req),
});

// Export handlers for GET and POST requests
export const GET = handler;
export const POST = handler;