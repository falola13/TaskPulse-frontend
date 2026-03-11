import axios, { AxiosError } from "axios";

interface ApiErrorResponse {
  error?: string;
  message?: string;
  // extend if your API sends additional properties
  data?: {
    error?: string;
    message?: string;
  };
}
const extractDeepMessage = (str: string): string => {
  try {
    const jsonMatch = str.match(/\{.*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.message || parsed.error || str;
    }
  } catch (e) {
    // If parsing fails, just return the original string
  }
  return str;
};
export const handleError = (error: unknown): string => {
  const defaultMessage =
    "An unexpected error occurred. Please try again later.";

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (!axiosError.response) {
      return "Unable to connect. Please check your internet connection and try again.";
    }

    const { status, data } = axiosError.response;

    // 1. Prioritize deep extraction from data.data.error (where your specific error was)
    if (data?.data?.message) return extractDeepMessage(data.data.message);
    if (data?.data?.error) return extractDeepMessage(data.data.error);

    // 2. Fallback to standard error fields
    if (data?.message) return extractDeepMessage(data.message);
    if (data?.error) return extractDeepMessage(data.error);

    // 3. Handle by status code if no message was provided by API
    if (status >= 500)
      return "A server error occurred. Please try again later.";
    if (status === 404) return "The requested resource was not found.";
    if (status === 401) return "You are not authorized. Please log in.";
    if (status === 400) return "Bad request. Please check your input.";

    return `An error occurred (status ${status}).`;
  }

  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  console.error("Unhandled error type:", error);
  return defaultMessage;
};
