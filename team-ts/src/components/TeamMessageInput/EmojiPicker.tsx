import { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import {useMessageComposer, useMessageInputContext} from 'stream-chat-react';
import Picker from '@emoji-mart/react';


import { MessageInputControlButton } from './MessageInputControls';

// similar to EmojiPicker from "stream-chat-react/emojis"
// but with custom wrappers and button
export const EmojiPicker = () => {
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
  });
  const { textComposer } = useMessageComposer();
  const [emojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false);
  const { textareaRef } = useMessageInputContext();

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
          className='str-chat__message-textarea-emoji-picker-container'
          style={styles.popper}
          {...attributes.popper}
          ref={setPopperElement}
        >
          <Picker
            theme='light'
            data={async () => (await import('@emoji-mart/data')).default}
            onEmojiSelect={(e: { native: string }) => {
              const textarea = textareaRef.current;
              if (!textarea) return;
              textComposer.insertText({ text: e.native });
              textarea.focus();
            }}
          />
        </div>
      )}
      <MessageInputControlButton
        type='emoji'
        onClick={() => setEmojiPickerIsOpen((open) => !open)}
        ref={setReferenceElement}
      />
    </>
  );
};
