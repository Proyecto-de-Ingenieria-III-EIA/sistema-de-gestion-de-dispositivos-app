import { format, parseISO } from "date-fns"

/**
 * Safely parses a date string to a Date object
 * 
 * @param dateString The date string to parse
 * @returns A Date object
 */
export const parseDate = (dateString: string): Date => {
  try {
    return parseISO(dateString)
  } catch {
    return new Date(dateString)
  }
}

/**
 * Safely formats a date string to a human-readable format
 * 
 * @param dateString The date string to format
 * @param formatString The format string to use (defaults to "MMM d, yyyy")
 * @param fallback The fallback value if formatting fails
 * @returns A formatted date string
 */
export const formatDate = (
  dateString: string, 
  formatString: string = "MMM d, yyyy", 
  fallback: string = "Invalid Date"
): string => {
  try {
    const date = parseDate(dateString)
    return format(date, formatString)
  } catch (error) {
    console.error("Error formatting date:", error)
    return fallback
  }
}