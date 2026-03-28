'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseStableFetchOptions {
    deps?: unknown[];
    enabled?: boolean;
}

interface UseStableFetchReturn<T> {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useStableFetch<T>(
    fetchFn: () => Promise<T>,
    options: UseStableFetchOptions = {},
): UseStableFetchReturn<T> {
    const { deps = [], enabled = true } = options;

    const [data, setData] = useState<T | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const fetchFnRef = useRef(fetchFn);
    fetchFnRef.current = fetchFn;

    const executeFetch = useCallback(async (signal: AbortSignal) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchFnRef.current();
            if (!signal.aborted) {
                setData(result);
            }
        } catch (err) {
            if (!signal.aborted) {
                const fetchError = err instanceof Error ? err : new Error(String(err));
                setError(fetchError);
                console.error('useStableFetch error:', fetchError);
            }
        } finally {
            if (!signal.aborted) {
                setIsLoading(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        if (!enabled) {
            setIsLoading(false);
            return;
        }

        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        executeFetch(controller.signal);

        return () => {
            controller.abort();
        };
    }, [enabled, executeFetch]);

    const refetch = useCallback(async () => {
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;
        await executeFetch(controller.signal);
    }, [executeFetch]);

    return { data, isLoading, error, refetch };
}
