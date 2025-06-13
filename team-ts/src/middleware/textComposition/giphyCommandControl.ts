import {
  CommandSuggestion,
  MessageComposer,
  MiddlewareHandlerParams,
  TextComposerMiddlewareExecutorState
} from "stream-chat";

export const createGiphyCommandControlMiddleware = (composer: MessageComposer) => {
  const trigger = '/giphy ';
  return ({
    id: 'demo-team/text-composer/giphy-command-control',
    handlers: {
      onChange: ({forward, complete, state}: MiddlewareHandlerParams<TextComposerMiddlewareExecutorState>) => {
        const {attachmentManager} = composer;
        const hasNonUploadAttachments = attachmentManager.attachments.filter((att) => !att.localMetadata.uploadState).length > 0;
        const hasUploadAttachments = attachmentManager.uploadsInProgressCount + attachmentManager.successfulUploadsCount > 0;
        if (hasUploadAttachments || hasNonUploadAttachments) {
          return forward();
        }

        const {customDataManager} = composer;
        if (!state.text && customDataManager.customComposerData.command) {
          customDataManager.setCustomData({command: null})
          return forward();
        }
        if (!state.text.startsWith(trigger) || customDataManager.customComposerData.command) {
          return forward();
        }

        customDataManager.setCustomData({command: 'giphy'});
        const newText = state.text.slice(trigger.length);
        return complete({
            ...state,
            text: newText,
            selection: {start: state.selection.start - trigger.length, end: state.selection.end - trigger.length},
        });
      },
      onSuggestionItemSelect: ({
        forward,
        complete,
        state
      }: MiddlewareHandlerParams<TextComposerMiddlewareExecutorState<CommandSuggestion>>) => {
        const { selectedSuggestion } = state.change ?? {};
        if (selectedSuggestion?.name !== 'giphy')
          return forward();

        composer.customDataManager.setCustomData({command: 'giphy'});
        const newText = state.text.slice(trigger.length);
        return complete({
            ...state,
            text: newText,
            selection: {start: state.selection.start - trigger.length, end: state.selection.end - trigger.length},
        });
      }
    }
  });
};