export const channelByUser = async (props) => {
  const { client, setActiveChannel, channel } = props;

  const filters = {
    type: 'messaging',
    member_count: 2,
    members: { $eq: [client.user.id, client.userID || ''] },
  };

  const [existingChannel] = await client.queryChannels(filters);

  if (existingChannel) {
    return setActiveChannel(existingChannel);
  }

  const newChannel = client.channel('messaging', {
    members: [channel.id, client.userID || ''],
  });
  return setActiveChannel(newChannel);
};