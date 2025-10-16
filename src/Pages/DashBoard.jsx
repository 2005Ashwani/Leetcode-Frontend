import { Globe, Github, Linkedin, Twitter } from "lucide-react";
import axiosClient from "../utils/axiosClient";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function DashBoard() {
  const [isLoading, setIsLoading] = useState(false);
  const [getProfile, setGetProfile] = useState({}); // To Get the profile
  const [SolvedProblem, setSolvedProblem] = useState([]); // Setting all the problem - Initialized as an empty array // Initializing with [] is safer for map operations
  const [totalProblem, setTotalProblem] = useState();
  const [easy, setEasy] = useState([]);
  const [medium, setMedium] = useState([]);
  const [hard, setHard] = useState([]);

  // Me
  const [matched, setMatched] = useState();

  const navigate = useNavigate();

  // To get the profile (Runs once on mount)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get("/auth/getProfile");
        const profileData = response.data;
        setGetProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile data.");
        // If profile fetch fails, we'll stop the loading state here.
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  //  Get All the problems and filter the solved ones (Runs when getProfile updates)
  useEffect(() => {
    // Only proceed if getProfile has been successfully loaded and has problemSolved data
    if (getProfile && getProfile.problemSolved) {
      const fetchProblem = async () => {
        try {
          // Set loading state here, as this is where problem data is fetched
          setIsLoading(true);

          const data = await axiosClient.get("/problem/getAllProblem");

          //  Compute the solved problems array immediately
          const allProblems = data.data || [];
          const solvedProblemIds = getProfile.problemSolved || [];

          // Storing the total Problem
          setTotalProblem(allProblems);

          const prom = allProblems.filter((item) =>
            solvedProblemIds.includes(item._id)
          );

          //  Update the SolvedProblem state
          setSolvedProblem(prom);

          //  Filter solved problems by difficulty using the 'prom' array, not the state
          const easy = prom.filter((item) => item.difficulty === "easy");
          const medium = prom.filter((item) => item.difficulty === "medium");
          const hard = prom.filter((item) => item.difficulty === "hard");

          //  Update difficulty states
          setEasy(easy);
          setMedium(medium);
          setHard(hard);
        } catch (error) {
          console.error("Failed to fetch Submitted Problem:", error);
          toast.error("Failed to load Submitted Problems.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProblem();
    } else if (getProfile && Object.keys(getProfile).length > 0) {
      // If profile loaded but has no problemSolved array (or it's an empty object), just set loading to false
      setIsLoading(false);
    }
  }, [getProfile]);

  // To Get the Submitted Problem

  useEffect(() => {
    const fetchSubmittionProblem = async () => {
      try {
        const data = await axiosClient.get("/submission/getSubmittedProblem");
        const submissions = data.data;

        // Filtered problem
        const matchedProblems = submissions.filter(
          (sub) => String(sub.userId) === String(getProfile._id)
        );

        // Update state with matched problems
        setMatched(matchedProblems);
      } catch (error) {
        console.log("Error fetching submissions:", error);
      }
    };

    // Only run if profile & problems are available
    if (getProfile && SolvedProblem.length > 0) {
      fetchSubmittionProblem();
    }
  }, [getProfile, SolvedProblem]);

  //  To Print
  useEffect(() => {
    console.log("Kar chuka HUn", matched);
  }, [matched, getProfile]); //

  return (
    <div>
      {/* ... (rest of the component remains the same) */}
      {isLoading === false ? (
        <div className="min-h-screen bg-[#0d1117] text-white p-6 flex flex-col md:flex-row gap-6">
          {/* ... (Left Profile Card) ... */}
          <div className="bg-[#161b22] p-5 rounded-xl w-full md:w-1/4 border border-gray-800">
            {/* ... (Profile details) ... */}
            <div className="flex flex-col items-center">
              <img
                src={getProfile.profileImage}
                alt="profile"
                className="w-24 h-24 rounded-full border-2 border-purple-500"
              />

              <h2 className="mt-3 text-lg font-semibold">
                {getProfile.firstName}
                {" " + getProfile.lastName}
              </h2>

              <p className="text-sm text-gray-400">{getProfile.email}</p>

              <p className="text-sm mt-2 text-center text-gray-300">
                Interested in coding and web development
              </p>

              <button
                className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-1 rounded-md text-sm font-medium"
                onClick={() => navigate("/edit")}
              >
                Edit Profile
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div>📍 India</div>
              <div>🎓 ABSS Institute Of Technology Meerut</div>
              <a
                href="https://ashwanitech.netlify.app/"
                target="blank"
                className="flex items-center gap-2 text-blue-400 hover:underline"
              >
                <Globe size={16} /> Contact Me
              </a>
              <div className="flex gap-3 mt-2">
                <Github className="cursor-pointer" size={18} />
                <Twitter className="cursor-pointer" size={18} />
                <Linkedin className="cursor-pointer" size={18} />
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {["Python", "C", "HTML", "CSS", "JavaScript"].map((lang) => (
                  <span
                    key={lang}
                    className="bg-gray-800 text-xs px-2 py-1 rounded-md border border-gray-700"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-gray-700 pt-4">
              <h3 className="font-semibold mb-2">Community Stats</h3>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Views</span>
                <span>0</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Solution</span>
                <span>0</span>
              </div>
            </div>
          </div>

          {/* Right Dashboard Content */}
          <div className="flex-1 space-y-6">
            {/* Progress + Rank Section */}
            <div className="flex flex-wrap gap-6">
              {/* Program  */}
              <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 flex-1 min-w-[300px] flex justify-evenly">
                {/* Problem Solved Section */}
                <div className="flex flex-col items-center justify-center p-4">
                  <h3 className="text-gray-300 font-semibold mb-6 uppercase tracking-wider">
                    Problems Solved
                  </h3>

                  {/* Interactive Total Problem Circle - Perfectly Centered Content */}
                  {/* W-48/H-48 for better visual, group for hover effect, relative for positioning */}
                  <div className="relative w-48 h-48 group">
                    {}
                    <div className="absolute inset-0 rounded-full border-[8px] border-yellow-500 flex flex-col items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                      <span className="text-4xl font-extrabold text-white leading-none">
                        {getProfile?.problemSolved?.length}
                      </span>
                      <span className="text-lg font-medium text-gray-400">
                        / {totalProblem?.length}
                      </span>
                    </div>

                    {}
                    <div className="absolute inset-0 rounded-full bg-gray-900 border-[8px] border-gray-700 flex flex-col items-center justify-center p-5 opacity-0 group-hover:opacity-100 transition duration-300 transform scale-95 group-hover:scale-100">
                      <p className="text-md font-bold text-green-400 mb-1">
                        Easy: <span className="text-xl">{easy?.length}</span>
                      </p>
                      <p className="text-md font-bold text-orange-400 mb-1">
                        Medium:{" "}
                        <span className="text-xl">{medium?.length}</span>
                      </p>
                      <p className="text-md font-bold text-red-500">
                        Hard: <span className="text-xl">{hard?.length}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Difficulty Stats Section */}
                <div className="flex flex-col gap-4 pt-4">
                  <h3 className="text-gray-400 font-medium text-center uppercase text-sm tracking-widest">
                    Difficulty Stats
                  </h3>
                  <div className="flex flex-col gap-3">
                    {/* Increased contrast/hover on difficulty boxes for better UI */}
                    <div className="h-16 w-40 p-2 text-lg flex justify-center items-center bg-gray-800 hover:bg-green-900/40 transition text-green-400 rounded-xl shadow-md">
                      <p>
                        Easy: <span className="font-bold">{easy?.length}</span>
                      </p>
                    </div>
                    <div className="h-16 w-40 p-2 text-lg flex justify-center items-center bg-gray-800 hover:bg-orange-900/40 transition text-orange-400 rounded-xl shadow-md">
                      <p>
                        Medium:{" "}
                        <span className="font-bold">{medium?.length}</span>
                      </p>
                    </div>
                    <div className="h-16 w-40 p-2 text-lg flex justify-center items-center bg-gray-800 hover:bg-red-900/40 transition text-red-500 rounded-xl shadow-md">
                      <p>
                        Hard: <span className="font-bold">{hard?.length}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 w-64 flex justify-center items-center  ">
                <div className="flex justify-center items-center border- bg-gray-700 w-50 h-50 rounded-full border-[6px] border-yellow-500">
                  <h1 className="font-semibold text-2xl">Rank</h1>
                  <h3 className="text-2xl font-bold">
                    ~
                    {SolvedProblem[0]?.difficulty == "easy"
                      ? Math.ceil(
                          (SolvedProblem?.length / totalProblem?.length) *
                            100 *
                            1
                        )
                      : SolvedProblem[0]?.difficulty == "medium"
                      ? Math.ceil(
                          (SolvedProblem?.length / totalProblem?.length) *
                            100 *
                            3
                        )
                      : Math.ceil(
                          (SolvedProblem?.length / totalProblem?.length) *
                            100 *
                            5
                        )}
                  </h3>
                </div>
              </div>
            </div>

            {/* Activity Calendar */}
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold mb-2">
                Submissions in the Past Year
              </h3>
              <p className="text-sm text-gray-400 mb-3">Total Active Days: 1</p>
              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 bg-gray-700 rounded-sm hover:bg-green-600 transition-all"
                  ></div>
                ))}
              </div>
            </div>

            {/* Recent AC Submissions */}
            <div className=" border bg-[#161b22] rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-xl">
                  Recent Accepted Solutions
                </h3>
                <button className="text-blue-400 hover:underline text-xl">
                  View all
                </button>
              </div>

              <div className="space-y-3">
                {/* // to show the recent Submitted Solution  */}
              </div>

              {/* --- Display All Problems --- */}
              <div className="flex flex-col gap-7">
                {SolvedProblem.length > 0 ? (
                  // Map through all problems and render a card for each
                  SolvedProblem.map((problemItem) => (
                    <div
                      key={problemItem._id}
                      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex items-center p-4 min-h-16"
                    >
                      {/* The card-body now acts as the single-line content wrapper */}
                      <div className="card-body flex flex-row items-center justify-between p-0 w-full">
                        {/* Problem Title with Link - Takes up available space */}
                        <button
                          className="card-title text-lg font-semibold mr-4 text-green-500 hover:text-green-400 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer"
                          onClick={() =>
                            navigate(`/problem/${problemItem._id}`)
                          }
                        >

                          {/* Show Recent Problem  */}
                          {problemItem?.tittle}
                        </button>

                        {/* Difficulty - Right aligned */}
                        <div className="text-xl font-medium w-20 text-right ">
                          {problemItem.difficulty}
                        </div>

                        {/* Time - Right aligned */}
                        <div className="text-sm text-gray-400 w-32 text-right">
                          {(() => {
                            // Find the submission for this problem by the current user
                            const matchedItem = matched?.find(
                              (item) =>
                                item.userId === getProfile._id &&
                                item.problemId === problemItem._id
                            );

                            if (matchedItem) {
                              const date = new Date(matchedItem.updatedAt);
                              // Format: YYYY-MM-DD HH:MM:SS
                              return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                            }

                            return "-";
                          })()}
                        </div>


                      </div>
                    </div>
                  ))
                ) : (
                  // Message if no problems exist
                  <div className="col-span-full text-center p-8 bg-gray-700 rounded-lg shadow-md border border-gray-800">
                    <p className="text-xl text-info font-medium">
                      No problems solved yet. Start coding!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen bg-gray-900">
          <motion.div
            className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
}
