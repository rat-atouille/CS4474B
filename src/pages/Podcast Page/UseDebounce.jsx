import { useEffect, useCallback } from 'react';

export default function useDebounce(callBackFn, dependencies, delay) {
  const callback = useCallback(callBackFn, dependencies);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}