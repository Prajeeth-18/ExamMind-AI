import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Results() {

  const [resultData, setResultData] = useState(null);

  useEffect(() => {

    const storedResult = sessionStorage.getItem(
      "evaluation_result"
    );

    if (storedResult) {

      try {

        const parsedResult = JSON.parse(
          storedResult
        );

        setResultData(parsedResult);

      } catch (error) {

        console.error(
          "Unable to read evaluation result:",
          error
        );

      }

    }

  }, []);

  if (!resultData) {

    return (

      <div className="flex bg-[#050816] min-h-screen">

        <Sidebar />

        <div className="flex-1">

          <Navbar />

          <div className="p-10">

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">

              <h1 className="text-4xl font-bold text-white">
                Evaluation Results
              </h1>

              <p className="text-slate-400 mt-3">
                No evaluation result is available yet.
              </p>

              <p className="text-slate-500 mt-2">
                Complete an answer-sheet evaluation from the AI Scan Room.
              </p>

            </div>

          </div>

        </div>

      </div>

    );

  }

  const results = resultData.results || [];

  const totalMarks = results.reduce(
    (total, item) =>
      total + Number(item.evaluation?.marks || 0),
    0
  );

  const totalMaxMarks = results.length * 10;

  const overallPercentage =
    totalMaxMarks > 0
      ? Math.round(
          (totalMarks / totalMaxMarks) * 100
        )
      : 0;

  return (

    <div className="flex bg-[#050816] min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-10">

          {/* ================= HEADER ================= */}

          <div className="mb-8">

            <p className="text-cyan-400 font-semibold tracking-wide">
              EXAMMIND AI
            </p>

            <h1 className="text-4xl font-bold text-white mt-2">
              Evaluation Results
            </h1>

            <p className="text-slate-400 mt-2">
              AI-powered concept-based descriptive answer evaluation.
            </p>

          </div>

          {/* ================= SUMMARY ================= */}

          <div className="grid grid-cols-3 gap-6 mb-8">

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

              <p className="text-slate-400">
                Total Marks
              </p>

              <h2 className="text-4xl font-bold text-white mt-2">
                {totalMarks}
                <span className="text-xl text-slate-500">
                  {" "}
                  / {totalMaxMarks}
                </span>
              </h2>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

              <p className="text-slate-400">
                Overall Percentage
              </p>

              <h2 className="text-4xl font-bold text-cyan-400 mt-2">
                {overallPercentage}%
              </h2>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

              <p className="text-slate-400">
                Questions Evaluated
              </p>

              <h2 className="text-4xl font-bold text-white mt-2">
                {results.length}
              </h2>

            </div>

          </div>

          {/* ================= QUESTION RESULTS ================= */}

          <div className="space-y-6">

            {results.map((item, index) => {

              const evaluation =
                item.evaluation || {};

              return (

                <div
                  key={index}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
                >

                  {/* QUESTION HEADER */}

                  <div className="flex justify-between items-center">

                    <div>

                      <p className="text-cyan-400 font-semibold">
                        Question {item.question_no}
                      </p>

                      <h2 className="text-2xl font-bold text-white mt-1">
                        Evaluation
                      </h2>

                    </div>

                    <div className="text-right">

                      <p className="text-slate-400 text-sm">
                        Marks Awarded
                      </p>

                      <p className="text-3xl font-bold text-green-400">
                        {evaluation.marks ?? 0}
                      </p>

                    </div>

                  </div>

                  {/* ================= PERCENTAGE ================= */}

                  <div className="mt-6">

                    <div className="flex justify-between text-sm mb-2">

                      <span className="text-slate-400">
                        Conceptual Evaluation
                      </span>

                      <span className="text-white font-semibold">
                        {evaluation.percentage ?? 0}%
                      </span>

                    </div>

                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            Number(evaluation.percentage || 0),
                            100
                          )}%`
                        }}
                      />

                    </div>

                  </div>

                  {/* ================= STRENGTHS ================= */}

                  {evaluation.strengths?.length > 0 && (

                    <div className="mt-7">

                      <h3 className="text-lg font-semibold text-white">
                        Concepts Understood
                      </h3>

                      <div className="flex flex-wrap gap-2 mt-3">

                        {evaluation.strengths.map(
                          (strength, i) => (

                            <span
                              key={i}
                              className="px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
                            >
                              ✓ {strength}
                            </span>

                          )
                        )}

                      </div>

                    </div>

                  )}

                  {/* ================= UNDERSTOOD CONCEPTS ================= */}

                  {evaluation.concepts_understood?.length > 0 && (

                    <div className="mt-7">

                      <h3 className="text-lg font-semibold text-white">
                        Concepts Understood
                      </h3>

                      <ul className="mt-3 space-y-2">

                        {evaluation.concepts_understood.map(
                          (concept, i) => (

                            <li
                              key={i}
                              className="text-slate-300"
                            >
                              <span className="text-green-400 mr-2">
                                ✓
                              </span>

                              {concept}

                            </li>

                          )
                        )}

                      </ul>

                    </div>

                  )}

                  {/* ================= MISSING CONCEPTS ================= */}

                  {(evaluation.concepts_missing?.length > 0 ||
                    evaluation.missing_points?.length > 0) && (

                    <div className="mt-7">

                      <h3 className="text-lg font-semibold text-white">
                        Missing Concepts
                      </h3>

                      <ul className="mt-3 space-y-2">

                        {(
                          evaluation.concepts_missing?.length
                            ? evaluation.concepts_missing
                            : evaluation.missing_points
                        ).map(
                          (concept, i) => (

                            <li
                              key={i}
                              className="text-slate-300"
                            >
                              <span className="text-yellow-400 mr-2">
                                !
                              </span>

                              {concept}

                            </li>

                          )
                        )}

                      </ul>

                    </div>

                  )}

                  {/* ================= FEEDBACK ================= */}

                  {evaluation.feedback && (

                    <div className="mt-7 bg-slate-800/50 border border-slate-700 rounded-2xl p-5">

                      <h3 className="text-lg font-semibold text-white">
                        AI Evaluation Feedback
                      </h3>

                      <p className="text-slate-300 mt-2 leading-relaxed">
                        {evaluation.feedback}
                      </p>

                    </div>

                  )}

                </div>

              );

            })}

          </div>

        </div>

      </div>

    </div>

  );

}

export default Results;