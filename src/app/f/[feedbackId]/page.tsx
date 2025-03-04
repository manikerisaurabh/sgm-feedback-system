/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useFeedback } from "@/context/FeedbackContext";
import { createNewResponseAction } from "@/actions/responses";

export default function FeedbackPage() {
  const { feedbackId } = useParams();
  const { MOCK_DATA } = useFeedback();
  const facultyRef = useRef<HTMLDivElement | null>(null);

  const feedback = MOCK_DATA.find((f) => f.id.toString() === feedbackId);

  const [responses, setResponses] = useState<{ [key: number]: number[] }>({});
  const [submitted, setSubmitted] = useState(false);
  const [authenticationCode, setAuthenticationCode] = useState("");

  const [nextFaculty, setNextFaculty] = useState(0);

  if (!feedback)
    return <div className="text-center text-red-500">Feedback not found!</div>;

  //this kind of object should be created when any student fill the feedback form
  const response = {
    response: [
      {
        saurabh: {
          q1: {
            mark: 15.5,
            rating: 2,
          },
          q2: {
            mark: 15.5,
            rating: 2,
          },
          q3: {
            mark: 15.5,
            rating: 2,
          },
          q4: {
            mark: 15.5,
            rating: 2,
          },
          q5: {
            mark: 15.5,
            rating: 2,
          },
          q6: {
            mark: 15.5,
            rating: 2,
          },
        },
        kiran: {
          q1: {
            mark: 15.5,
            rating: 2,
          },
          q2: {
            mark: 15.5,
            rating: 2,
          },
          q3: {
            mark: 15.5,
            rating: 2,
          },
          q4: {
            mark: 15.5,
            rating: 2,
          },
          q5: {
            mark: 15.5,
            rating: 2,
          },
          q6: {
            mark: 15.5,
            rating: 2,
          },
        },
      },
    ],
    unique_code: "A12",
    feedback_id: "b10f9f33-7bf5-486f-bc60-e5fb2fc0e72c",
  };

  const handleResponseChange = (
    facultyId: number,
    questionId: number,
    value: number
  ) => {
    setResponses((prev) => {
      const updatedResponses = { ...prev };
      if (!updatedResponses[facultyId]) updatedResponses[facultyId] = [];
      updatedResponses[facultyId][questionId] = value;
      return updatedResponses;
    });
  };

  const nextFacultySubmit = (facultyId: number) => {
    let isValid = true;

    feedback.questions.forEach((_, qIndex) => {
      if (!responses[facultyId]?.[qIndex]) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = () => {
    let isValid = true;

    feedback.faculties.forEach((faculty) => {
      feedback.questions.forEach((_, qIndex) => {
        if (!responses[faculty.id]?.[qIndex]) {
          isValid = false;
        }
      });
    });

    if (!isValid) {
      alert("Please answer all questions before submitting.");
      return;
    }

    console.log(responses);
    setSubmitted(true);
  };

  const calculateAverages = (facultyId: number) => {
    const facultyResponses = responses[facultyId] || [];
    const questionAverages = facultyResponses.map((sum, i) => sum || 0);
    const overallAverage =
      questionAverages.length > 0
        ? questionAverages.reduce((a, b) => a + b, 0) / questionAverages.length
        : 0;
    return { overallAverage, questionAverages };
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    insertResponse();
  }, []);
  const insertResponse = async () => {
    const data = await createNewResponseAction(response);
    console.log("response after inserting resp : ", data);
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col items-center py-16 px-2 mt-8"
      ref={facultyRef}
    >
      {!submitted ? (
        <div className="bg-white p-2 rounded-lg shadow-lg w-full max-w-2xl border border-black">
          <h1 className="text-3xl font-bold text-center p-1">
            Student Feedback about Teaching Learning
          </h1>
          <hr className="border-2 border-black" />

          <h1 className="ml-4 mt-2">Academic Year : {feedback.academicYear}</h1>
          <h1 className="ml-4">Department : {feedback.department}</h1>
          <h1 className="ml-4">
            Semester : {feedback.semester} ({feedback.term}){" "}
          </h1>

          <hr className="border-1 border-black my-1" />

          <div className="ml-4 mt-2 mb-6">
            <label className="block text-lg font-semibold mb-1">
              Authentication Code
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Authentication Code"
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 border-gray-300"
              value={authenticationCode}
              onChange={(e) => setAuthenticationCode(e.target.value)}
            ></input>
          </div>

          <hr className="border-2 border-black mb-6" />

          {feedback.faculties.map((faculty, index) => (
            <div
              key={faculty.id}
              className={`mb-6 p-1 sm:p-4 bg-gray-50 rounded-lg border border-gray-300 ${
                nextFaculty !== index ? "hidden" : ""
              }`}
            >
              <h2 className="font-semibold mb-1">
                {faculty.name} -{" "}
                <span className="text-gray-600 text-sm">{faculty.subject}</span>
              </h2>

              <div className="border-t border-gray-600 my-4"></div>

              <div className="sm:pl-4 flex justify-between text-xs font-bold">
                <div className="flex w-11/12 justify-center">
                  <p>Questions</p>
                </div>
                <div className="flex gap-1 w-6/12 sm:w-3/12">
                  <p className="w-1/2 flex justify-center">Weights</p>
                  <p className="w-1/2 flex justify-center">Rattings</p>
                </div>
              </div>

              <div className="border-t border-gray-300 my-1"></div>

              <div className="sm:pl-4">
                {feedback.questions.map((question, qIndex) => (
                  <div key={question.id} className="mb-3 flex justify-between">
                    <div className="flex gap-2 w-11/12">
                      <p className="text-sm font-medium">
                        {"Q"}
                        {qIndex + 1})
                      </p>
                      <p className="text-sm font-medium">
                        {question.question}{" "}
                        <span className="text-red-500">*</span>
                      </p>
                    </div>
                    <div className="flex gap-1 h-full w-6/12 sm:w-3/12">
                      <select
                        className="sm:p-1 border rounded-md text-sm border-gray-400 w-1/2 h-8"
                        value={responses[faculty.id]?.[qIndex] || ""}
                        onChange={(e) =>
                          handleResponseChange(
                            faculty.id,
                            qIndex,
                            Number(e.target.value)
                          )
                        }
                      >
                        <option value=""></option>
                        {feedback.ratingOptions.map((option, optIndex) => (
                          <option
                            key={optIndex}
                            value={option}
                            className={`${
                              responses?.[faculty.id]?.includes(option)
                                ? "hidden"
                                : ""
                            }`}
                          >
                            {option}
                          </option>
                        ))}
                      </select>

                      <select
                        className="sm:p-1 border rounded-md text-sm border-gray-400 w-1/2"
                        onChange={(e) => {
                          // Logic goes here
                        }}
                      >
                        <option value=""></option>
                        {[1, 2, 3, 4, 5].map((option, optIndex) => (
                          <option key={optIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <button
              onClick={() => {
                setNextFaculty(nextFaculty - 1);

                // Scroll to the faculty section smoothly
                if (facultyRef.current) {
                  facultyRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className={`text-white px-4 py-2 rounded-md  transition ${
                nextFaculty == 0
                  ? "bg-gray-600"
                  : "bg-blue-600 hover:bg-blue-500"
              } ${nextFaculty == 0 ? "cursor-not-allowed" : "bg-blue-600"}`}
              disabled={nextFaculty == 0}
            >
              Previous Faculty
            </button>

            {nextFaculty != feedback.faculties.length - 1 ? (
              <button
                onClick={() => {
                  if (nextFacultySubmit(feedback.faculties[nextFaculty].id)) {
                    setNextFaculty((prev) => prev + 1);

                    // Scroll smoothly to the next faculty section
                    if (facultyRef.current) {
                      facultyRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  } else {
                    alert("Please answer all questions before proceeding!");
                  }
                }}
                className={`text-white px-4 py-2 rounded-md transition ${
                  nextFaculty === feedback.faculties.length - 1
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
                disabled={nextFaculty === feedback.faculties.length - 1}
              >
                Next Faculty
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-white p-2 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">
            Feedback Summary
          </h1>

          {feedback.faculties.map((faculty) => {
            const { overallAverage, questionAverages } = calculateAverages(
              faculty.id
            );

            return (
              <div
                key={faculty.id}
                className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-600"
              >
                <h2 className="text-lg font-semibold mb-2">
                  {faculty.name} -{" "}
                  <span className="text-gray-600">{faculty.subject}</span>
                </h2>
                <p className="text-sm font-medium">
                  <span className="font-bold">Overall Average:</span>{" "}
                  {overallAverage.toFixed(2)}
                </p>
                <div className="border-t border-gray-600 my-3"></div>
                <div className="mt-3">
                  <div className="text-gray-900 flex justify-between gap-3">
                    <div className="font-semibold">Questions</div>
                    <div className="font-semibold">Rating</div>
                  </div>

                  <div className="p-2">
                    {feedback.questions.map((question, qIndex) => (
                      <div
                        key={question.id}
                        className="text-xs text-gray-700 flex justify-between gap-3"
                      >
                        <div className="font-medium">
                          {"Q" + (qIndex + 1) + ") "}
                          {question.question}:
                        </div>{" "}
                        <div>
                          {questionAverages[qIndex]
                            ? questionAverages[qIndex].toFixed(2)
                            : "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
