const Notification = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div key={message.id} className={`notification ${message.type}`}>
      {message.text}
    </div>
  );
};

export default Notification;
