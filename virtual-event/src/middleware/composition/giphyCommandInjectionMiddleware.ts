import type {
  MessageComposer,
  MessageComposerMiddlewareValueState,
  MessageDraftComposerMiddlewareValueState,
  MiddlewareHandlerParams
} from "stream-chat";

export const createGiphyCommandInjectionMiddleware = (composer: MessageComposer) => ({
  id: 'demo-team/message-composer-middleware/giphy-command-injection',
  compose: ({
    input,
    nextHandler,
  }: MiddlewareHandlerParams<MessageComposerMiddlewareValueState>) => {
    const {custom: {command}} = composer.customDataManager.state.getLatestValue();
    const {attachments, text} = input.state.localMessage;
    const injection = command && `/${command}`;
    if (command !== 'giphy' || !injection || text?.startsWith(injection) || attachments?.length) return nextHandler(input);
    const enrichedText = `${injection} ${text}`
    return nextHandler({
      ...input,
      state: {
        ...input.state,
        localMessage: {
          ...input.state.localMessage,
          text: enrichedText,
        },
        message: {
          ...input.state.message,
          text: enrichedText,
        },
      },
    });
  }
});
export const createDraftGiphyCommandInjectionMiddleware = (composer: MessageComposer) => ({
  id: 'demo-team/message-composer-middleware/draft-giphy-command-injection',
  compose: ({
    input,
    nextHandler,
  }: MiddlewareHandlerParams<MessageDraftComposerMiddlewareValueState>) => {
    const {custom: {command}} = composer.customDataManager.state.getLatestValue();
    const text = input.state.draft.text;
    const injection = command && `/${command}`;
    if (command !== 'giphy' || !injection || text?.startsWith(injection)) return nextHandler(input);
    const enrichedText = `${injection} ${text}`
    return nextHandler({
      ...input,
      state: {
        ...input.state,
        draft: {
          ...input.state.draft,
          text: enrichedText,
        },
      },
    });
  }
});