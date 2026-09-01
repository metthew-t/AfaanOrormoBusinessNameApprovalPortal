import { useState, useEffect, useCallback, useRef } from 'react';
import { extractData, extractErrorMessage } from '@/utils/apiHelpers';

/**
 * Hook for async data fetching.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useAsync(() => getMyApplications(), []);
 *
 * Options:
 *   immediate : boolean (default true) — run on mount
 *   transform : (rawData) => any — transform extracted data
 */
export function useAsync(asyncFn, deps = [], { immediate = true, transform } = {}) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError]     = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await asyncFn();
      const raw  = extractData(res);
      const out  = transform ? transform(raw) : raw;
      if (mountedRef.current) setData(out);
    } catch (err) {
      if (mountedRef.current) setError(extractErrorMessage(err));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  return { data, loading, error, refetch: execute };
}

/**
 * Simplified hook for mutations (POST/PUT/DELETE).
 *
 * const { mutate, loading, error } = useMutation(createApplication);
 * await mutate(payload);
 */
export function useMutation(mutFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const mutate = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await mutFn(...args);
      return extractData(res);
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutFn]);

  return { mutate, loading, error, setError };
}
