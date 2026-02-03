import { useEffect, useState } from "react";

interface IUseLocalStorage {
  key: string;
  initialState: {
    [key: string]: any;
  };
}

export const useLocalStorage = ({ key, initialState }: IUseLocalStorage) => {
  const [state, setState] = useState(initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const item = localStorage.getItem(key);
    if (item) {
      const parsedItem = JSON.parse(item);
      if (JSON.stringify(parsedItem) !== JSON.stringify(initialState)) {
        setState(parsedItem);
      }
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
