import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UploadCard from "../components/UploadCard";

import { uploadAnswerKey } from "../services/examApi";

function UploadAnswerKey() {

  const navigate = useNavigate();

  const examId = localStorage.getItem("exam_id");

  async function handleUpload(file) {

    if (!examId) {

      alert("Please create an exam first.");

      navigate("/create-exam");

      return;

    }

    try {

      await uploadAnswerKey(examId, file);

      alert("Knowledge Base Created Successfully");

      navigate("/student-evaluation");

    }

    catch (error) {

      console.error(error);

      alert("Answer Key Upload Failed");

    }

  }

  return (

    <div className="flex bg-[#050816] min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-10">

          <UploadCard

            title="Upload Answer Key"

            description="Upload the official answer key. Gemini AI will build the conceptual knowledge base."

            buttonText="Build AI Knowledge"

            onUpload={handleUpload}

          />

        </div>

      </div>

    </div>

  );

}

export default UploadAnswerKey;