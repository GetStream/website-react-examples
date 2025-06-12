import { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import {useMessageComposer, useMessageInputContext} from 'stream-chat-react';
import Picker from '@emoji-mart/react';


import { EmojiPickerIcon } from '../../assets';
import { useEventContext } from '../../contexts/EventContext';

// similar to EmojiPicker from "stream-chat-react/emojis"
// but with custom wrappers and button
export const EmojiPicker = () => {
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top-end',
  });
  const { textComposer } = useMessageComposer();
  const [emojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false);
  const { textareaRef, cooldownRemaining } = useMessageInputContext();
  const { mode } = useEventContext();

  useEffect(() => {
    if (!popperElement || !referenceElement) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;

      if (popperElement.contains(target) || referenceElement.contains(target)) return;

      setEmojiPickerIsOpen(false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [referenceElement, popperElement]);

  return (
    <>
      {emojiPickerIsOpen && (
        <div
          className='input-ui-input-emoji-picker'
  // @ts-ignore
          style={styles.popper}
          {...attributes.popper}
          ref={setPopperElement}
        >
          <Picker
            data={async () => (await import('@emoji-mart/data')).default}
            theme={mode}
            onEmojiSelect={(e: { native: string }) => {
              const textarea = textareaRef.current;
              if (!textarea) return;
              textComposer.insertText({ text: e.native });
              textarea.focus();
            }}
          />
        </div>
      )}
      <button
        className={`input-ui-input-emoji-picker-button ${cooldownRemaining ? 'cooldown' : ''}`}
        ref={setReferenceElement}
        onClick={() =>
          setEmojiPickerIsOpen((open) => {
            if (cooldownRemaining) return false;
            return !open;
          })
        }
      >
        <EmojiPickerIcon />
      </button>
    </>
  );
};
