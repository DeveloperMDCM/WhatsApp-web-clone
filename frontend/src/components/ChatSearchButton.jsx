
const ChatSearchButton = ({ modalRef }) => {
  const handleOpenModal = () => {
    modalRef.current.openModal();
  };

  return (
    <div>
      <button
        onClick={() => {
          handleOpenModal();
        }}
        className="p-2  text-white rounded-lg shadow hover:bg-gray-600"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
          <path d="M21 21l-6 -6"></path>
        </svg>
      </button>

      {/* <MessageModal    onSearch={onSearch}  /> */}
    </div>
  );
};

export default ChatSearchButton;
