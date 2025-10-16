import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Editorial({ problem }) {
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [like, setLike] = useState(0);
  const [disLike, setDisLike] = useState(0);
  const [Comments, setComments] = useState([]);
  const [status, setStatus] = useState("pending");
  const [commentInput, setCommentInput] = useState("");

  // Fetch The Video
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axiosClient.get(`/video/${problem._id}`);
        setStatus(response.data.status);
        setVideo(response.data);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, [problem._id]);

  // to get the like and dislike count from the backend
  const fetchLikes = async () => {
    if (!video) return;

    try {
      const response = await axiosClient.get(`/video/like/${video._id}`);
      setLike(response.data.likes);
      setDisLike(response.data.disLike);
      setComments(Array.isArray(response.data.comments) ? response.data.comments : []);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [video?._id]);

  useEffect(() => {
    console.log(video?._d);
    console.log(like);
    console.log(disLike);
  });

  return (
    <div>
      {status === "created" ? (
        <div className="max-w-2xl mx-auto p-4">
          {/* Problem Title */}
          <h1 className="flex justify-center text-2xl font-bold text-white bg-gradient-to-r from-gray-500 to-blue-900 p-3 rounded-xl shadow-md">
            {problem.tittle}
          </h1>

          <div className="mt-6 border border-gray-700 rounded-2xl bg-gray-900 shadow-lg p-5">
            <div className="flex justify-center flex-col items-center">
              {video ? (
                <div className="flex flex-col items-center w-full">
                  {/* Video */}
                  <video
                    src={video.secureUrl}
                    poster={video.thumbnailUrl}
                    controls
                    width="100%"
                    className="rounded-2xl shadow-xl border border-gray-700 max-w-md mb-4"
                  />

                  {/*  Like /  Dislike Buttons */}
                  <div className="flex justify-center mt-3 p-2 w-full">
                    <div className="flex items-center gap-6 bg-gray-800 px-6 py-3 rounded-full border border-gray-700 shadow-inner">
                      {/* Like Button */}
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-300 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300 cursor-pointer"
                        onClick={async () => {
                          try {
                            await axiosClient.post(`/video/like/${video._id}`, {
                              like: like + 1,
                              dislikes: disLike,
                            });
                            fetchLikes(); // Refetch to update UI
                          } catch (error) {
                            console.error("Error liking video:", error);
                          }
                        }}
                      >
                        <ThumbsUp className="w-5 h-5" />
                        <span className="font-semibold text-sm">{like}</span>
                      </button>

                      {/* Dislike Button */}
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-300 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
                        onClick={async () => {
                          try {
                            await axiosClient.post(`/video/like/${video._id}`, {
                              like: like,
                              dislikes: disLike + 1,
                            });
                            fetchLikes(); // Refetch to update UI
                          } catch (error) {
                            console.error("Error disliking video:", error);
                          }
                        }}
                      >
                        <ThumbsDown className="w-5 h-5" />
                        <span className="font-semibold text-sm">{disLike}</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section (Static UI only) */}
                  <div className="w-full max-w-md mt-6">
                    {/* Example Comments */}
                    <div className="space-y-3">
                      {Comments.length > 0 ? (
                        Comments.map((comment, index) => (
                          <div key={index} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                            <p className="text-gray-200 text-sm">{comment}</p>
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                          <p className="text-gray-400 text-sm">No comments yet. Be the first to comment!</p>
                        </div>
                      )}
                    </div>

                    {/* Input Box */}
                    <div className="flex items-center gap-2 mb-4 mt-8">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-400 focus:outline-none"
                      />
                      <button
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300"
                        onClick={async () => {
                          if (!commentInput.trim()) return;
                          try {
                            await axiosClient.post(`/video/like/${video._id}`, {
                              comment: commentInput,
                            });
                            setCommentInput(""); // Clear input
                            fetchLikes(); // Refetch to update UI
                          } catch (error) {
                            console.error("Error posting comment:", error);
                          }
                        }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Loading video...</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-screen bg-[#1e1e1e] text-white space-y-6">
          {/* Lock Icon */}
          <div className="bg-[#2d2d2d] p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-orange-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm6-10a4 4 0 00-8 0v4h8v-4z"
              />
            </svg>
          </div>

          {/* Text */}
          <h2 className="text-2xl font-semibold">Subscribe to unlock.</h2>
          <p className="text-gray-400 text-center max-w-md">
            Thanks for using{" "}
            <span className="text-white font-medium">AlgoSnap</span>! To view
            this solution you must subscribe to premium.
          </p>

          {/* Subscribe Button */}
          <button
            className="flex justify-center items-center px-8 py-3 rounded-xl text-lg font-semibold bg-orange-400 text-black hover:bg-orange-500 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-orange-500/30"
            onClick={() =>
              navigate("/Payment", { state: { problem_ID: problem._id } })
            }
          >
            Subscribe
          </button>
        </div>
      )}
    </div>
  );
}
