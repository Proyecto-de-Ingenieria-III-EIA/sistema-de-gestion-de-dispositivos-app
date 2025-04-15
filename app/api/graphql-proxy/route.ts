import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/auth';
import { prisma } from '@/prisma';

export async function POST(req: Request) {
  try {
    // Get the authenticated session
    const session = await getServerSession(authConfig);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the session token from the database
    const dbSession = await prisma.session.findFirst({
      where: {
        user: {
          email: session.user.email
        }
      },
      select: {
        sessionToken: true
      }
    });

    if (!dbSession?.sessionToken) {
      return NextResponse.json(
        { error: 'Session token not found' },
        { status: 401 }
      );
    }

    // Get the GraphQL query from the request
    const { query, variables } = await req.json();

    // Forward the request to the internal GraphQL endpoint
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'session-token': dbSession.sessionToken
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    // Return the response from the GraphQL server
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('GraphQL proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 