import React, { useCallback, useState } from 'react';

type UseBoolStateParams = {
  initValue?: boolean;
  setState?: React.Dispatch<React.SetStateAction<boolean>>;
};

type BoolStateController = {
  off: () => void;
  on: () => void;
  toggle: () => void;
  state: boolean;
}

export const useBoolState = (
  { initValue, setState }: UseBoolStateParams = { initValue: false },
): BoolStateController => {
  const [state, _setState] = useState<boolean>(initValue as boolean);
  const setStateFinal = setState || _setState;

  const off = useCallback(() => {
    setStateFinal(false);
  }, []); // eslint-disable-line

  const on = useCallback(() => {
    setStateFinal(true);
  }, []); // eslint-disable-line

  const toggle = useCallback(() => {
    setStateFinal((prev: boolean | undefined) => !prev);
  }, []); // eslint-disable-line

  return {
    off,
    on,
    toggle,
    state,
  };
};
