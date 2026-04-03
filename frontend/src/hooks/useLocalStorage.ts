import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
    } finally {
      setHasHydrated(true);
    }
  }, [key]);

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    setStoredValue((currentValue) => {
      const valueToStore = value instanceof Function ? value(currentValue) : value;

      if (typeof window !== 'undefined' && hasHydrated) {
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(`Error saving localStorage key "${key}":`, error);
        }
      }

      return valueToStore;
    });
  };

  useEffect(() => {
    if (!hasHydrated || typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  }, [hasHydrated, key, storedValue]);

  return [storedValue, setValue, hasHydrated] as const;
}
