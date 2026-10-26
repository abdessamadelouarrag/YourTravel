import { useState, useCallback, useRef } from "react";
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  const [error, setError] = useState(false);
  const current = useRef(value);
  const update = useCallback(
    (next) => {
      const result = typeof next === "function" ? next(current.current) : next;
      let persisted = true;
      try {
        localStorage.setItem(key, JSON.stringify(result));
      } catch {
        persisted = false;
      }
      current.current = result;
      setValue(result);
      setError(!persisted);
      return persisted;
    },
    [key],
  );
  return [value, update, error];
}
