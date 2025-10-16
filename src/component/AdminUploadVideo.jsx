import { useParams } from "react-router-dom";
import axios from "axios";
import axiosClient from "../utils/axiosClient";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AdminUpload() {
  const { problemId } = useParams();
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const onSubmit = async (data) => {
    setErrorMsg(null);
    const file = data.videoFile && data.videoFile[0];
    if (!file) return setErrorMsg("Please select a video file");

    setUploading(true);
    setUploadProgress(0);

    try {
      // 1) get signature + upload url from backend
      const sigRes = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, upload_url } =
        sigRes.data;

      // 2) upload to Cloudinary using a proper FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", api_key);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      // ensure we pass the public_id so it's predictable
      if (public_id) formData.append("public_id", public_id);

      const uploadResp = await axios.post(upload_url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) => {
          if (!ev.total) return;
          const percent = Math.round((ev.loaded * 100) / ev.total);
          setUploadProgress(percent);
        },
      });

      const cloudinaryResult = uploadResp.data;

      // 3) save metadata to backend
      const saveResp = await axiosClient.post(`/video/save`, {
        cloudinaryPublicId: cloudinaryResult.public_id,
        publicId: cloudinaryResult.public_id,
        problemId,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(saveResp.data.videoSolution || cloudinaryResult);
      reset();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || err.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl shadow-2xl p-6 border border-gray-700 backdrop-blur-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-purple-700/30">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            Upload Your Video 🎥
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* File Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-gray-300 font-medium">
                  Choose a video file
                </span>
              </label>
              <input
                type="file"
                accept="video/*"
                {...register("videoFile", { required: true })}
                className="file-input w-full text-sm text-gray-200 border-2 border-dashed border-indigo-500 bg-gray-900 hover:border-purple-500 hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                disabled={uploading}
              />
              {errors.videoFile && (
                <label className="label">
                  <span className="label-text-alt text-red-400">
                    ⚠️ Please select a file
                  </span>
                </label>
              )}
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2 animate-pulse">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="alert bg-red-900/40 border border-red-600 text-red-300 shadow-lg animate-fade-in">
                 {errorMsg}
              </div>
            )}

            {/* Success Message */}
            {uploadedVideo && (
              <div className="alert bg-green-900/30 border border-green-600 text-green-300 shadow-lg animate-fade-in">
                <div>
                  <h3 className="font-bold text-lg">✅ Upload Successful!</h3>
                  <p className="text-sm opacity-80">
                    Duration: {uploadedVideo.duration}
                  </p>
                  <p className="text-sm opacity-80">
                    Uploaded:{" "}
                    {new Date(
                      uploadedVideo.uploadedAt || Date.now()
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={uploading}
                className={`cursor-pointer px-5 py-2.5 font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 hover:shadow-purple-600/50 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  uploading ? "opacity-70 cursor-not-allowed " : ""
                }`}
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Uploading...
                  </span>
                ) : (
                  "Upload Video"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
