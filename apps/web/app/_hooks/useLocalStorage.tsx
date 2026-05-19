import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

interface IUseLocalStorage<T> {
  key: string;
  initialState: T;
}

export const useLocalStorage = <T,>({
  key,
  initialState,
}: IUseLocalStorage<T>) => {
  const [state, setState] = useState<T>(initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const item = localStorage.getItem(key);
    if (item) {
      const parsedItem = JSON.parse(item) as T;
      if (JSON.stringify(parsedItem) !== JSON.stringify(initialState)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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

  return [state, setState] as [T, Dispatch<SetStateAction<T>>];
};
