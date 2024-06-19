import { useEffect, useState } from 'react';
import ApiRequest from '../utils/apiRequests';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const apiUrl = `/mail`;

    try {
      const res = await ApiRequest.get(apiUrl);
      console.log(res);
      const data = res?.data?.mails;
      if (data) {
        const sortedMessages = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMessages(sortedMessages);
        setLoading(false);
      } else {
        setLoading(true);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load Messages");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 pb-2">
        Messages
      </h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-wrap -mx-4">
        {messages.map((message) => (
          <div key={message.id} className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-6">
            <div className="bg-white p-4 rounded shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">{message.name}</h2>
              <p className="text-gray-500">{message.email}</p>
              <p className="mt-2">{message.message}</p>
              <p className="text-gray-400 text-sm mt-2">{new Date(message.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
