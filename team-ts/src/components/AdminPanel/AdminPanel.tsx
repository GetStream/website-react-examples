import { useCallback } from 'react';
import { useWorkspaceController } from '../../context/WorkspaceController';
import { AdminPanelForm, FormValues } from './context/AdminPanelFormContext';
import { CreateChannel } from './CreateChannel';
import { EditChannel } from './EditChannel';
import { useChatContext } from 'stream-chat-react';

export const AdminPanel = () => {
  const { client } = useChatContext();
  const { activeChannel: channel, displayWorkspace, activeWorkspace } = useWorkspaceController();
  const onSubmit = useCallback(() => displayWorkspace('Chat'), [displayWorkspace]);

  let defaultFormValues: FormValues = {name: '', members: []};
  let Form = null;

  if (activeWorkspace.match('Channel-Create')) {
    defaultFormValues = { members: client.userID ? [client.userID] : [], name: '', };
    Form = CreateChannel;
  } else if (activeWorkspace.match('Channel-Edit')) {
    defaultFormValues= { members: [], name: channel?.data?.custom?.name || (channel?.data?.id as string), };
    Form = EditChannel;
  }
  return (
    <AdminPanelForm workspace={activeWorkspace} onSubmit={onSubmit} defaultValues={defaultFormValues}>
      <div className='channel__container'>
        { Form && <Form />}
      </div>
    </AdminPanelForm>
  );
};