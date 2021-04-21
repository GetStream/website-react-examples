type Props = {
  closeThread?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  setPinsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CloseThreadIcon = (props: Props) => {
  const { closeThread, setPinsOpen } = props;

  return (
    <div
      onClick={(event) => {
        if (closeThread) {
          closeThread(event);
        }
        if (setPinsOpen) {
          setPinsOpen(false);
        }
      }}
      className='close-thread-icon'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='40'
        height='40'
        fill='none'
        viewBox='0 0 40 40'
      >
        <path
          fill='var(--primary-color)'
          fillRule='evenodd'
          d='M27.563 25.442L22.12 20l5.442-5.442a1.496 1.496 0 000-2.12 1.496 1.496 0 00-2.121 0L20 17.878l-5.441-5.442a1.496 1.496 0 00-2.121 0 1.496 1.496 0 000 2.121L17.879 20l-5.441 5.442a1.496 1.496 0 000 2.12 1.496 1.496 0 002.12 0L20 22.122l5.442 5.442a1.496 1.496 0 002.12 0 1.504 1.504 0 000-2.121z'
          clipRule='evenodd'
        ></path>
        <rect width='39' height='39' x='0.5' y='0.5' stroke='#E9E9EA' rx='19.5'></rect>
      </svg>
    </div>
  );
};
