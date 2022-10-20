import React, { useContext } from 'react';

type ThreadInputContextValue = {
  footerChecked: boolean;
  toggleCheckedFooter: () => void;
}
export const ThreadInputContext = React.createContext<ThreadInputContextValue>({
  footerChecked: false,
  toggleCheckedFooter: () => null,
});

export const useThreadInputContext = () => {
  return useContext(ThreadInputContext);
};