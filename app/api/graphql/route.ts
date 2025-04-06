import { resolvers, types } from '@/graphql';
import { prisma } from '@/prisma';

import { Context, AuthData } from '@/types';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Enum_RoleName } from '@prisma/client';
import { NextRequest } from 'next/server';

export const schema = makeExecutableSchema({ typeDefs: types, resolvers });

const server = new ApolloServer<Context>({
  schema,
});

const nextHandler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    let authDataQuery: AuthData[] = [];
    const token = req.headers.get('session-token');
    if (token) {
      authDataQuery = (await prisma.$queryRaw`
        select 
          u.email,
          r."name" as "role",
          s.expires
        from "Session" s
            join "User" u on s."userId" = u.id
            join "Role" r on u."roleId" = r.id
        where s."sessionToken" = ${token}
      `) as AuthData[];
    } else {
      // Fallback: use headers set by your middleware
      const email = req.headers.get('x-user-email');
      const role = req.headers.get('x-user-role');
      if (email && role) {
        // Cast role to Enum_RoleName; ensure that the header value is valid!
        authDataQuery = [{ email, role: role as unknown as Enum_RoleName, expires: new Date() }];
      }
    }
    // Removed throwing error here; let resolvers handle missing authData.
    return {
      db: prisma,
      authData: authDataQuery[0] || null,
    };
  },
});

async function corsHandler(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST",
        "access-control-allow-headers": request.headers.get("access-control-request-headers") || "*",
        "access-control-allow-credentials": "true",
      },
    });
  }
  const response = await nextHandler(request);
  response.headers.set("access-control-allow-origin", "*");
  response.headers.set("access-control-allow-credentials", "true");
  response.headers.set("access-control-allow-methods", "POST");
  return response;
}

// Export named HTTP methods
export const GET = corsHandler;
export const POST = corsHandler;
export const OPTIONS = corsHandler;