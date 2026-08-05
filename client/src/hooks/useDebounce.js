import { useEffect, useState } from 'react';

// Delays updating the returned value until `delay` ms after the input stops
// changing — use for search inputs so you don't fire an API call per keystroke.
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
