export const TeamChannelPreview = ({name}: {name: string}) => (
  <div className='channel-preview__item' title={name}>
    <p>{`# ${name}`}</p>
  </div>
);