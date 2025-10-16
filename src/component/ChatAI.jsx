import { useForm } from "react-hook-form";
import { Send, Copy } from "lucide-react"; // Added Copy icon
import { useEffect, useRef } from "react";
import axiosClient from "../utils/axiosClient";

//  Redux imports
import { useSelector, useDispatch } from "react-redux";
import { addMessage, setError } from "../redux/AiHistorySlicer_ALGORANK";

const ChatAI = ({ problem }) => {
  // Redux store connection
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.storeChat);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Ref for auto-scroll
  const messageEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //  Handle form submit (send message to backend)
  const onSubmit = async (data) => {
    // 1 Create the new user message object
    const newMessage = { role: "user", parts: [{ text: data.message }] };

    // Add user message immediately (optimistic UI update)
    dispatch(addMessage(newMessage));

    //   Clear input field
    reset();

    try {
      // 4️ Prepare full conversation for backend
      const messagesToSend = [...messages, newMessage];

      // 5️ Call backend API with chat history + problem details
      const response = await axiosClient.post("/ai/chat", {
        messages: messagesToSend,
        tittle: problem.tittle,
        description: problem.description,
        startCode: problem.startCode,
        visibleTestCases: problem.visibleTestCases,
      });

      // 6️ Parse backend response safely
      let parsed;
      try {
        parsed = JSON.parse(response.data.message);
      } catch {
        parsed = { text: response.data.message }; // fallback if plain text
      }

      // 7️ Append model response into messages (Redux)
      dispatch(addMessage({ role: "model", parts: [parsed] }));
    } catch (error) {
      console.error(error);

      // 8️ Handle API error gracefully
      dispatch(
        addMessage({
          role: "model",
          parts: [{ text: "X Oops! Something went wrong." }],
        })
      );

      // 9️ Store error in Redux for debugging/logging
      dispatch(setError(error.message));
    }
  };

  //  Copy code to clipboard
  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };


  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans rounded-2xl">
      {/*  Chat messages area */}
      <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } animate-fade-in`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-2xl p-4 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 rounded-br-none hover:scale-[1.03]"
                    : "bg-gradient-to-r from-gray-700 to-gray-800 rounded-bl-none hover:scale-[1.03]"
                }`}
              >
                {/*  User message */}
                {message.role === "user" && (
                  <p className="text-sm leading-relaxed text-white">
                    🙋 {message.parts[0].text}
                  </p>
                )}

                {/*  Model message */}
                {message.role === "model" && (
                  <div className="space-y-3">
                    {/* 🧾 Text response */}
                    {message.parts[0].text && (
                      <p className="text-sm leading-relaxed text-green-300 whitespace-pre-wrap">
                        {message.parts[0].text}
                      </p>
                    )}

                    {/*  Code block with copy button */}
                    {message.parts[0].code && (
                      <div className="relative">
                        {/*  Copy button */}
                        <button
                          onClick={() => handleCopy(message.parts[0].code)}
                          className="absolute top-2 right-2 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-md hover:bg-gray-600 transition"
                        >
                          <Copy size={14} />
                        </button>

                        {/*  Code area */}
                        <pre className="bg-black/80 p-4 rounded-lg text-xs overflow-x-auto font-mono border border-gray-700">
                          <code>{message.parts[0].code}</code>
                        </pre>
                      </div>
                    )}

                    {/* ⏱ Time Complexity */}
                    {message.parts[0].timeComplexity && (
                      <p className="text-xs text-gray-400">
                        ⏱ Time Complexity:{" "}
                        <span className="text-gray-200">
                          {message.parts[0].timeComplexity}
                        </span>
                      </p>
                    )}

                    {/* 💾 Space Complexity */}
                    {message.parts[0].spaceComplexity && (
                      <p className="text-xs text-gray-400">
                        💾 Space Complexity:{" "}
                        <span className="text-gray-200">
                          {message.parts[0].spaceComplexity}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Scroll anchor */}
          <div ref={messageEndRef} />
        </div>
      </div>

      {/*  Input form fixed at bottom */}
      <div className="sticky bottom-0 bg-gray-900/90 backdrop-blur-lg p-4 shadow-lg border-t border-gray-700">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center space-x-3"
        >
          {/* Input */}
          <input
            type="text"
            className="flex-grow p-3 rounded-full bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 text-base placeholder:text-gray-400"
            placeholder="Type your message..."
            {...register("message", { required: true, minLength: 1 })}
          />

          {/*  Send button */}
          <button
            type="submit"
            className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </form>

        {/*  Error state */}
        {errors.message && (
          <p className="text-red-400 text-sm mt-2 ml-3">
            Message cannot be empty.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatAI;
