const Toast = ({ message, type }) => {
  return (
    <div
      className={`fixed bottom-4 right-4 px-6 py-3 rounded shadow-lg ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      {message}
    </div>
  );
};

export default Toast;