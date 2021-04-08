import { ImagePreviewer, FilePreviewer } from 'react-file-utils';
import { MessageInputHookProps, MessageInputState, useChannelContext } from 'stream-chat-react';

import type {
  AttachmentType,
  ChannelType,
  CommandType,
  EventType,
  MessageType,
  ReactionType,
  UserType,
} from '../../App';

export const UploadsPreview = ({
  fileOrder,
  fileUploads,
  imageOrder,
  imageUploads,
  numberOfUploads,
  removeFile,
  removeImage,
  uploadFile,
  uploadImage,
  uploadNewFiles,
}: MessageInputHookProps & MessageInputState) => {
  const channelContext = useChannelContext<
    AttachmentType,
    ChannelType,
    CommandType,
    EventType,
    MessageType,
    ReactionType,
    UserType
  >();

  return (
    <>
      {imageOrder.length > 0 && (
        <ImagePreviewer
          imageUploads={imageOrder.map((id: string) => imageUploads[id])}
          handleRemove={removeImage}
          handleRetry={uploadImage}
          handleFiles={uploadNewFiles}
          multiple={channelContext.multipleUploads}
          disabled={
            channelContext.maxNumberOfFiles !== undefined &&
            numberOfUploads >= channelContext.maxNumberOfFiles
          }
        />
      )}
      {fileOrder.length > 0 && (
        <FilePreviewer
          uploads={fileOrder.map((id: string) => fileUploads[id])}
          handleRemove={removeFile}
          handleRetry={uploadFile}
          handleFiles={uploadNewFiles}
        />
      )}
    </>
  );
};
