import {useCallback, useMemo} from 'react';
import {useChannelStateContext, useChatContext, useMessageComposer, useMessageInputContext} from 'stream-chat-react';
import type {MessageInputFormattingType} from "../../../types.stream";

const mdToFormattingType: Record<string, MessageInputFormattingType> = {
  '**': 'bold',
  '*': 'italics',
  '~~': 'strikethrough',
  '`': 'code',
}

export const formattingTypeToMarkdown: Record<MessageInputFormattingType, string> = {
  bold: '**',
  code: '`',
  italics: '*',
  strikethrough: '~~',
}

export const useMessageInputCompositionControls = () => {
  const { client } = useChatContext();
  const {
    channel,
  } = useChannelStateContext();
  const {customDataManager, textComposer} = useMessageComposer();
  const {textareaRef} = useMessageInputContext();
  const placeholder = useMemo(() => {
    let dynamicPart = 'the group';

    if (channel.type === 'team') {
      dynamicPart = `#${channel?.data?.name || channel?.data?.id || 'random'}`;

    }

    const members = Object.values(channel.state.members).filter(
      ({ user }) => user?.id !== client.userID,
    );
    if (!members.length || members.length === 1) {
      dynamicPart = members[0]?.user?.name || members[0]?.user?.id || 'Johnny Blaze';

    }

    return `Message ${dynamicPart}`;

  }, [channel.type, channel.state.members, channel?.data?.id, channel?.data?.name, client.userID]);

  const handleFormattingButtonClick = useCallback((wrappingMarkdown: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    let newSelection;
    const {activeFormatting} = customDataManager.customComposerData;
    if (!activeFormatting) {
      textComposer.wrapSelection({head: wrappingMarkdown, tail: wrappingMarkdown});
      customDataManager.setCustomData({activeFormatting: mdToFormattingType[wrappingMarkdown]});
      newSelection = {
        start:textComposer.selection.start,
        end: textComposer.selection.end,
      };
    } else {
      const activeMarkdown = formattingTypeToMarkdown[activeFormatting];
      newSelection = {
        start: textComposer.selection.start + activeMarkdown.length + wrappingMarkdown.length,
        end: textComposer.selection.end + +activeMarkdown.length + wrappingMarkdown.length,
      };
      if (wrappingMarkdown === activeMarkdown) {
        customDataManager.setCustomData({activeFormatting: null});
      } else {
        customDataManager.setCustomData({activeFormatting: mdToFormattingType[wrappingMarkdown]});
        textComposer.wrapSelection({head: wrappingMarkdown, selection: newSelection, tail: wrappingMarkdown});
      }
    }
    textarea.focus();
    /**
     * Some browsers (especially Chrome/Edge/WebKit) will move the caret to the end of the text after focus as part of their default focus-handling.
     * That happens after our JS runs, so it overwrites the position we set - browser invokes the event with the selection at the end of the textarea string
     */
    setTimeout(() => {
      textarea.setSelectionRange(newSelection.start, newSelection.end)
    }, 0);
  }, [customDataManager, textareaRef, textComposer])

  const formatter = useMemo<Record<MessageInputFormattingType, () => void>>(() => ({
    bold: () => handleFormattingButtonClick('**'),
    italics: () => handleFormattingButtonClick('*'),
    'strikethrough': () => handleFormattingButtonClick('~~'),
    code: () => handleFormattingButtonClick('`'),
  }), [handleFormattingButtonClick]);

  return {
    formatter,
    placeholder,
  }
}