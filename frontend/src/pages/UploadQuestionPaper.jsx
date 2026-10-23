import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UploadCard from "../components/UploadCard";

import { uploadQuestionPaper } from "../services/examApi";

function UploadQuestionPaper() {

  const navigate = useNavigate();

  const examId = localStorage.getItem("exam_id");

  async function handleUpload(file) {

    if (!examId) {

      alert("Please create an exam first.");

      navigate("/create-exam");

      return;

    }

    try {

      await uploadQuestionPaper(examId, file);

      alert("Question Paper Uploaded Successfully");

      navigate("/upload-answer-key");

    }

    catch (error) {

      console.error(error);

      alert("Question Paper Upload Failed");

    }

  }

  return (

    <div className="flex bg-[#050816] min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-10">

          <UploadCard

            title="Upload Question Paper"

            description="Drag & drop the official question paper PDF. AI will extract all questions automatically."

            buttonText="Upload Question Paper"

            onUpload={handleUpload}

          />

        </div>

      </div>

    </div>

  );

}

export default UploadQuestionPaper;