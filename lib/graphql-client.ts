/**
 * Simple GraphQL client for making GraphQL requests
 */

interface GraphQLRequestOptions {
  query: string;
  variables?: Record<string, unknown>;
  headers?: Record<string, string>;
}

/**
 * Make a GraphQL request to the API
 * 
 * @param options The request options
 * @returns The parsed JSON response
 */
export async function graphqlRequest<T = unknown>({ 
  query, 
  variables = {}, 
  headers = {}
}: GraphQLRequestOptions): Promise<{ data?: T; errors?: Array<{ message: string; locations?: Array<{ line: number; column: number }>; path?: string[] }> }> {
  try {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error('GraphQL request failed');
    }

    return result;
  } catch (error) {
    console.error('Error making GraphQL request:', error);
    return { errors: [{ message: 'Failed to make GraphQL request' }] };
  }
} 