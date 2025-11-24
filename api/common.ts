// This file can be used for common API utilities, types, or handlers.
// For instance, a common error handler function.

export function handleApiError(error: any) {
    console.error("API Error:", error);
    // In a real app, you might want to send this to a logging service.
    return {
        error: error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
    };
}
