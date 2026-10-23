import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { createExam } from "../services/examApi";

function CreateExam() {

  const [examName, setExamName] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleCreateExam() {

    if (examName.trim() === "") {

      alert("Please enter Exam Name");

      return;

    }

    try {

      setLoading(true);

      const data = await createExam(examName);

      localStorage.setItem("exam_id", data.exam_id);

      localStorage.setItem("exam_name", data.exam_name);

      alert("Exam Created Successfully");

      navigate("/upload-question-paper");

    }

    catch (error) {

      console.error(error);

      alert("Unable to create exam.");

    }

    finally {

      setLoading(false);

    }

  }

  return (

    <div className="flex bg-[#050816] min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="flex justify-center items-center h-[85vh]">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 w-[600px]">

            <h1 className="text-4xl font-bold text-white">

              Create New Exam

            </h1>

            <p className="text-slate-400 mt-3">

              Enter the exam name to start the evaluation workflow.

            </p>

            <div className="mt-10">

              <label className="text-slate-300">

                Exam Name

              </label>

              <input

                value={examName}

                onChange={(e)=>setExamName(e.target.value)}

                placeholder="Example : AI Mid Semester"

                className="w-full mt-3 p-4 rounded-xl
                bg-slate-800
                border border-slate-700
                text-white
                outline-none
                focus:border-blue-500"

              />

            </div>

            <button

              onClick={handleCreateExam}

              disabled={loading}

              className="mt-8 w-full p-4 rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              text-lg"

            >

              {

                loading

                ?

                "Creating Exam..."

                :

                "Create Exam"

              }

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default CreateExam;