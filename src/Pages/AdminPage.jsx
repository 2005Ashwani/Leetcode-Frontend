import { useNavigate } from "react-router-dom";
import { Video,Trash,Pencil,BadgePlus   } from "lucide-react";

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 py-10 px-4 sm:px-6 lg:px-8 font-poppins text-gray-100">
      <div className="max-w-4xl mx-auto">
        {/* Admin Panel Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-wide">
            Admin Panel
          </h1>
          <p className="text-lg text-gray-300">
            Empower your platform: manage coding problems with ease
          </p>
        </div>

        {/* Action Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Create Problem Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl-dark transition-all duration-300 p-8 flex flex-col items-center text-center border border-green-600/30">
           <div className="text-4xl font-extrabold text-white mb-4">
              <BadgePlus  className="w-10 h-10 text-green-700 drop-shadow-lg" />
            </div>
            <p className="text-md text-gray-300 mb-6">
              Add a brand new coding challenge to the platform's collection.
            </p>
            <button
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate("/admin")}
            >
              Add New Problem
            </button>
          </div>

          {/* Update Problem Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl-dark transition-all duration-300 p-8 flex flex-col items-center text-center border border-yellow-600/30  ">
            <div className="text-4xl font-extrabold text-white mb-4">
              <Pencil  className="w-10 h-10 text-yellow-700 drop-shadow-lg" />
            </div>
            <p className="text-md text-gray-300 mb-6">
              Refine existing problems, update details, or correct errors.
            </p>
            <button
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1  cursor-pointer"
              onClick={() => navigate("/modifyProblem")}
            >
              Edit Problem
            </button>
          </div>

          {/* Delete Problem Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl-dark transition-all duration-300 p-8 flex flex-col items-center text-center border border-red-600/30">
               <div className="text-4xl font-extrabold text-white mb-4">
              <Trash  className="w-10 h-10 text-red-400 drop-shadow-lg" />
            </div>
            <p className="text-md text-gray-300 mb-6">
              Permanently remove a problem from the platform's database.
            </p>
            <button
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate("/removeProblem")}
            >
              Remove Problem
            </button>
          </div>

          {/* Upload Video Card */}
          <div className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center border border-purple-300/20">
             <div className="text-4xl font-extrabold text-white mb-4">
              <Video className="w-10 h-10 text-purple-400 drop-shadow-lg" />
            </div>
            <p className="text-md text-gray-300 mb-6">
              Upload a video to the platform.
            </p>
            <button
              className="bg-gradient-to-r from-indigo-500 to-purple-600 
               hover:from-indigo-600 hover:to-purple-700
               text-white font-semibold py-3 px-8 rounded-full 
               shadow-md hover:shadow-lg 
               transition-all duration-300 
               transform hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate("/addvideo")}
            >
              Add Video
            </button>
          </div>

          
        </div>
      </div>
    </div>
  );
}
