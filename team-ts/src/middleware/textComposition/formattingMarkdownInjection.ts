import {MessageComposer, TextComposerMiddlewareParams, UserSuggestion} from "stream-chat";
import {formattingTypeToMarkdown} from "../../components/TeamMessageInput/hooks/useMessageInputCompositionControls";


export const createFormattingMarkdownInjectionMiddleware = (composer: MessageComposer) => {
  return ({
    id: 'demo-team/text-composer/formatting-markdown-injection',
    onChange: ({input, nextHandler}: TextComposerMiddlewareParams<UserSuggestion>) => {
      const formattingMarkdown = composer.customDataManager.customComposerData.activeFormatting;
      if (!formattingMarkdown) return nextHandler(input);
      const markdown = formattingTypeToMarkdown[formattingMarkdown];
      if (input.state.text.length || !markdown) return nextHandler(input);
      return nextHandler({
        ...input,
        state: {
          ...input.state,
          text:  `${markdown}${input.state.text}${markdown}`,
          selection: {start: markdown.length, end: markdown.length + input.state.text.length},
        }
      });
    },
  });
};