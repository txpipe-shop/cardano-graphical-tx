import { useEffect, useState } from "react";

interface IUseLocalStorage {
  key: string;
  initialState: {
    [key: string]: any;
  };
}

export const useLocalStorage = ({ key, initialState }: IUseLocalStorage) => {
  // Synchronously read from localStorage on client-side initialization
  const getInitialState = () => {
    if (typeof window === "undefined") {
      return initialState;
    }
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);
        return parsedItem;
      }
    } catch (error) {
      // If parsing fails, fall back to initialState
    }
    return initialState;
  };

  const [state, setState] = useState(getInitialState);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only sync if localStorage value differs from current state
    // (This handles cases where localStorage was updated externally)
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);
        if (JSON.stringify(parsedItem) !== JSON.stringify(state)) {
          setState(parsedItem);
        }
      }
    } catch (error) {
      // Ignore errors
    }
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(key, JSON.stringify(state));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, isInitialized]);

  return [state, setState];
};
