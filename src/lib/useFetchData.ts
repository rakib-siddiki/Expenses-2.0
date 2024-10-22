import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

// Define a type for the fetch function
type FetchFunction<T> = (() => Promise<T>) | undefined;

/**
 * Custom hook to fetch data using React Query.
 *
 * @param queryKey Unique key for the query
 * @param fetchFunction Function that fetches data and returns a promise
 * @param queryOptions Optional React Query options
 * @returns The result of the query, including data and error state
 */
export const useFetchData = <TQueryFnData, TError = Error, TData = TQueryFnData>(
    queryKey: string[],
    fetchFunction: FetchFunction<TQueryFnData>,
    queryOptions?: UseQueryOptions<TQueryFnData, TError, TData>,
): UseQueryResult<TData, TError> => {
    return useQuery<TQueryFnData, TError, TData>({
        queryKey,
        queryFn: fetchFunction,
        enabled: !!queryKey,
        staleTime: 10 * 60 * 1000, // Data is considered stale immediately
        refetchOnMount: true, // Refetch on component mount
        refetchOnWindowFocus: true, // Refetch when window regains focus
        refetchOnReconnect: true, // Refetch on network reconnection
        ...queryOptions,
    });
};
