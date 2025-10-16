// components/CodeEditor.jsx
import Editor from "@monaco-editor/react";
import axiosClient from "../utils/axiosClient";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import ProblemSubmission from "./problemSubmission";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ChatAI from "../component/ChatAI";
import Editorial from "../component/Editorial";
import { useSelector, useDispatch } from "react-redux";
import {
  initializeCode,
  setCode,
  setSelectedLanguage,
  setResult,
} from "../redux/codeSlicer";



const ProblemPage = () => {
  const dispatch = useDispatch();

  // Get codes object and selectedLanguage from Redux
  const { codes, selectedLanguage, result } = useSelector(
    (state) => state.storeCode
  );

  // Get current language's code
  const currentCode = codes[selectedLanguage];

  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leftContent, setLeftContent] = useState("Description");
  const [rightContent, setRightContent] = useState("code");
  const editorRef = useRef(null);
  const { problemId } = useParams();

  // Fetch problem on mount and initialize all codes
  useEffect(() => {
    const fetchProblem = async () => {
      setIsLoading(true);
      try {
        const response = await axiosClient.get(
          `/problem/problemById/${problemId}`
        );
        const data = response.data;
        setProblem(data);

        // Initialize codes for all three languages
        const initialCodes = {
          cpp:
            data?.startCode?.find((sc) => sc.language === "C++")?.initialCode ||
            "",
          Java:
            data?.startCode?.find((sc) => sc.language === "Java")
              ?.initialCode || "",
          JavaScript:
            data?.startCode?.find((sc) => sc.language === "JavaScript")
              ?.initialCode || "",
        };

        dispatch(initializeCode(initialCodes));
      } catch (error) {
        console.error("Error fetching problem:", error);
        alert(
          "Error fetching problem: " + (error.response?.data || error.message)
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblem();
  }, [problemId, dispatch]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // Handle editor change
  const handleEditorChange = (value) => {
    dispatch(setCode(value));
  };

  // Run code
  const handleRunCode = async () => {
    setIsLoading(true);
    dispatch(setResult(null));
    try {
      console.log("Running the code...");

      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code: currentCode,
        language:
          selectedLanguage === "cpp"
            ? "c++"
            : selectedLanguage === "JavaScript"
            ? "javascript"
            : "java",
      });

      const resultData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      dispatch(setResult(resultData));
      setRightContent("result");
    } catch (error) {
      console.error("Error running code:", error);
      const errorMessage = error.response?.data || error.message;
      alert("Error running code: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit code
  const handleSubmitCode = async () => {
    setIsLoading(true);
    dispatch(setResult(null));
    try {
      console.log("Submitting the problem...");

      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        {
          code: currentCode,
          language:
            selectedLanguage === "cpp"
              ? "c++"
              : selectedLanguage === "JavaScript"
              ? "JavaScript"
              : "Java",
        }
      );

      dispatch(setResult(response.data));
      setRightContent("result");
      console.log("Submission successful:", response.data);
      alert("Problem submitted successfully!");
    } catch (error) {
      console.error("Error submitting:", error);
      const errorMessage = error.response?.data || error.message;
      alert("Error submitting problem: " + errorMessage);

      if (
        errorMessage.includes("Token Not Present") ||
        errorMessage.includes("Invalid Token")
      ) {
        alert("Please login first before submitting code");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Debug log
  useEffect(() => {
    console.log(result);
  }, [result]);

  return (
    <div className="p-3">
      {isLoading ? (
<div className="grid grid-cols-1 gap-6 p-6 bg-base-100 rounded-lg shadow-md">
  {[...Array(3)].map((_, i) => (
    <div key={i} className="animate-pulse space-y-4">
      <div className="h-6 bg-base-300 rounded w-1/3 mx-auto"></div>
      <div className="h-4 bg-base-300 rounded w-3/4 mx-auto"></div>
      <div className="h-4 bg-base-300 rounded w-5/6 mx-auto"></div>
    </div>
  ))}
</div>
      ) : !problem ? (
        <div className="text-center text-red-500">Problem not found</div>
      ) : (
        <div className="flex gap-3 m-2">
          {/* Left Panel */}
          <div className="p-3 rounded-lg w-[50%]">
            <div className="flex justify-evenly mb-4">
              <button
                onClick={() => setLeftContent("Description")}
                className="btn"
              >
                Description
              </button>
              <button
                onClick={() => setLeftContent("Editorial")}
                className="btn"
              >
                Editorial
              </button>
              <button
                onClick={() => setLeftContent("Solution")}
                className="btn"
              >
                Solution
              </button>
              <button
                onClick={() => setLeftContent("Submission")}
                className="btn"
              >
                Submission
              </button>
              <button onClick={() => setLeftContent("chatAI")} className="btn">
                ChatAI
              </button>
            </div>

            {leftContent === "Description" && (
              <div className="bg-gray-700 text-white p-3 rounded-lg shadow h-[93%] overflow-y-auto">
                <h1 className="text-3xl font-bold mb-4">{problem?.tittle}</h1>

                <div className="mb-4">
                  <span className="font-semibold">Difficulty: </span>
                  <span className="text-green-400">
                    {problem.difficulty.toUpperCase()}
                  </span>
                  <span className="ml-4 font-semibold">Tags: </span>
                  <span className="text-green-400">
                    {problem.tags.toUpperCase()}
                  </span>
                </div>

                <div className="prose max-w-none mb-4">
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p>{problem.description}</p>
                </div>

                {problem.visibleTestCases?.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">
                      Example Test Cases
                    </h2>
                    {problem.visibleTestCases.map((testCase, index) => (
                      <div key={index} className="mb-2 p-2 bg-gray-700 rounded">
                        <div>
                          <strong>Input:</strong> {testCase.input}
                        </div>
                        <div>
                          <strong>Output:</strong> {testCase.output}
                        </div>
                        <div>
                          <strong>Explanation:</strong> {testCase.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {leftContent === "Solution" && (
              <div>
                <div className="flex justify-around">
                  <div className="font-bold text-2xl flex justify-center">
                    {problem?.tittle}
                  </div>
                  <div className="flex justify-start text-xl text-red-500">
                    {problem?.referenceSolution[0]?.language}
                  </div>
                </div>
                <div>
                  <SyntaxHighlighter language="cpp" style={dark}>
                    {problem?.referenceSolution?.[0]?.completeCode}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}

            {leftContent === "Editorial" && <Editorial problem={problem} />}

            {leftContent === "chatAI" && (
              <div>
                <h2 className="flex justify-center text-2xl font-bold">
                  CHAT WITH AI
                </h2>
                <div>
                  <ChatAI problem={problem} />
                </div>
              </div>
            )}

            {leftContent === "Submission" && (
              <div className="text-gray-500">
                <ProblemSubmission problemId={problemId} />
              </div>
            )}
          </div>

          {/* Right Panel - Code Editor */}
          <div className="flex flex-col p-4 w-1/2 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex gap-3">
                <button
                  onClick={() => setRightContent("code")}
                  className={`px-4 py-2 rounded-lg ${
                    rightContent === "code"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer"
                  }`}
                >
                  Code
                </button>
                <button
                  onClick={() => setRightContent("testcode")}
                  className={`px-4 py-2 rounded-lg ${
                    rightContent === "testcode"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer"
                  }`}
                >
                  Test Cases
                </button>
                <button
                  onClick={() => setRightContent("result")}
                  className={`px-4 py-2 rounded-lg ${
                    rightContent === "result"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer"
                  }`}
                >
                  Result
                </button>
              </div>

              <button
                onClick={handleRunCode}
                disabled={isLoading}
                className="px-5 py-2 bg-yellow-600 text-white rounded-xl shadow hover:bg-yellow-500 transition cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "Running..." : "Run"}
              </button>
            </div>

            {/* Editor Content */}
            <div className="flex flex-col bg-gray-900 rounded-xl shadow-inner overflow-hidden h-[75vh]">
              {rightContent === "code" && (
                <div className="flex flex-col h-full">
                  {/* Language Buttons */}
                  <div className="flex gap-4 bg-gray-800 px-4 py-2 border-b border-gray-700">
                    <button
                      onClick={() => dispatch(setSelectedLanguage("cpp"))}
                      className={`px-3 py-1 rounded-lg ${
                        selectedLanguage === "cpp"
                          ? "bg-yellow-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer"
                      }`}
                    >
                      C++
                    </button>
                    <button
                      onClick={() => dispatch(setSelectedLanguage("Java"))}
                      className={`px-3 py-1 rounded-lg ${
                        selectedLanguage === "Java"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer"
                      }`}
                    >
                      Java
                    </button>
                    <button
                      onClick={() =>
                        dispatch(setSelectedLanguage("JavaScript"))
                      }
                      className={`px-3 py-1 rounded-lg ${
                        selectedLanguage === "JavaScript"
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer"
                      }`}
                    >
                      JavaScript
                    </button>
                  </div>

                  {/* Monaco Editor */}
                  <Editor
                    key={selectedLanguage}
                    height="100%"
                    language={
                      selectedLanguage === "cpp"
                        ? "cpp"
                        : selectedLanguage === "JavaScript"
                        ? "javascript"
                        : "java"
                    }
                    theme="vs-dark"
                    value={currentCode}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                  />
                </div>
              )}

              {rightContent === "testcode" && result && (
                <div
                  className={`${
                    result?.accepted?.status?.toLowerCase?.() === "accepted" ||
                    result?.status?.description?.toLowerCase?.() === "accepted"
                      ? "bg-green-400 text-green-900"
                      : "bg-red-400 text-white"
                  } p-4 w-[80%] m-8 rounded-2xl`}
                >
                  <div>
                    <h1>
                      Status:
                      {result?.status?.description || result?.accepted?.status}
                    </h1>
                    <h1>Memory: {result?.memory} KB</h1>
                    <h1>Runtime: {result?.time || result?.runTime} Sec</h1>
                  </div>

                  {problem.visibleTestCases?.length > 0 && (
                    <div>
                      {problem.visibleTestCases.map((testCase, index) => (
                        <div
                          key={index}
                          className="mt-2 p-3 text-white bg-black rounded-2xl"
                        >
                          <div>
                            <strong>Input:</strong> {testCase.input}
                          </div>
                          <div>
                            <strong>Output:</strong> {testCase.output}
                          </div>
                          <div>
                            <strong>Explanation:</strong> {testCase.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {rightContent === "result" && result && (
                <div className="text-green-900 p-4 bg-green-400 w-[80%] m-8 rounded-2xl">
                  <h1>
                    Status:
                    {result?.status?.description || result?.accepted?.status}
                  </h1>
                  {result?.passedTestCases !== undefined && (
                    <h1>
                      Test Cases Passed: {result.passedTestCases}/
                      {result.totalTestCases}
                    </h1>
                  )}
                  <h1>Memory: {result?.memory} KB</h1>
                  <h1>Runtime: {result?.time || result?.runTime} Sec</h1>
                </div>
              )}

              {rightContent === "result" && !result && (
                <div className="text-gray-400 p-4 m-8">
                  No results yet. Run or submit your code to see results.
                </div>
              )}
            </div>

            <button
              onClick={handleSubmitCode}
              disabled={isLoading}
              className="px-5 py-2 mt-10 bg-green-600 text-white rounded-xl shadow hover:bg-green-500 transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;
