import React, { Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';

export type GiphyContextValue = {
  giphyState: boolean;
  setGiphyState: Dispatch<SetStateAction<boolean>>;
};

const GiphyContext = React.createContext<GiphyContextValue | null>(null);

/**
 * A convenience wrapper around React's default Context.Provider.
 *
 * @param props the props.
 * @constructor
 */
export const GiphyContextProvider = (props: PropsWithChildren<unknown>) => {
  const [giphyState, setGiphyState] = useState(false);
  return (
    <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
      {props.children}
    </GiphyContext.Provider>
  );
};

/**
 * A convenience hook for consuming GiphyContext value.
 */
export const useGiphyContext = () => {
  return useContext(GiphyContext) as GiphyContextValue;
};
