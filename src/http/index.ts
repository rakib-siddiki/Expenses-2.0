import { REQUIRED_SECURITY_KEY, SECURITY_HEADER_NAME } from '../configs/env';

/**
 * Performs a fetch request to the given endpoint and returns the result as an
 * array of two elements. The first element is the parsed JSON response, and the
 * second element is an error if the request was not successful.
 *
 * @param endpoint The URL to fetch
 * @param body Optional body for POST requests
 * @param options Optional fetch options (e.g., headers, method)
 * @returns An array containing the parsed JSON response and an error if the request failed
 */
export const tryCatch = async <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit,
): Promise<[T | null, Error | null]> => {
    try {
        const response = await fetch(endpoint, {
            method: options?.method ?? 'GET',
            headers: {
                'Content-Type': 'application/json',
                [SECURITY_HEADER_NAME]: REQUIRED_SECURITY_KEY,
                ...options?.headers,
            },
            // TODO : Change this to 'no-store'
            // cache: 'no-store',
            next: { revalidate: 60 },
            body: body ? JSON.stringify(body) : undefined,
            ...options,
        });
        // if (!response.ok) {
        //     throw new Error(`Network response was not ok: ${response.statusText}`);
        // }

        const data: T = (await response.json()) as T;
        return [data, null];
    } catch (error) {
        if (error instanceof Error) {
            return [null, error];
        } else {
            return [null, new Error('An unknown error occurred')];
        }
    }
};
