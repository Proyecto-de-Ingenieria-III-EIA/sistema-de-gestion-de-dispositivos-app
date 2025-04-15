"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { graphqlRequest } from "@/lib/graphql-client"
import { Loan } from "@/types/loans"

interface GetLoansByUserEmailResponse {
  getLoansByUserEmail: Loan[]
}

interface GetLoansByUserEmailInput {
  userEmail: string
}

const GET_LOANS_BY_USER_EMAIL = `
  query GetLoansByUserEmail($input: getLoansByUserEmailInput!) {
    getLoansByUserEmail(input: $input) {
      id
      startDate
      endDate
      originCity {
        name
      }
      status
      devices {
        brand
        model
        category
        serialNumber
      }
    }
  }
`

export function useUserLoans() {
  const { data: session, status } = useSession()
  const [loans, setLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchLoans() {
      if (status !== "authenticated" || !session?.user?.email) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        
        // Use a proxy API route that will handle authentication properly
        // This will use the session cookie which is already included in requests to your own API
        const response = await fetch('/api/graphql-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: GET_LOANS_BY_USER_EMAIL,
            variables: {
              input: {
                userEmail: session.user.email,
              },
            }
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch loans from proxy');
        }

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0]?.message || "Error fetching loans");
        }

        if (result.data?.getLoansByUserEmail) {
          setLoans(result.data.getLoansByUserEmail);
        }
      } catch (err) {
        console.error("Error fetching user loans:", err)
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoans()
  }, [session, status])

  return { loans, isLoading, error }
} 