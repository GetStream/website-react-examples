import { useEffect } from 'react';

type UseOnClickOutsideParams = {
  targets: Array<HTMLElement | null>;
  onClickOutside: (e: MouseEvent) => void;
};

export const useOnClickOutside = ({ onClickOutside, targets = [] }: UseOnClickOutsideParams) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (targets.every((target) => target && !target?.contains(event.target as Node))) {
        onClickOutside(event);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClickOutside, targets]);
};
