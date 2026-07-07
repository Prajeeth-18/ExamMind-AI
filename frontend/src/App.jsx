import { useRef, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import StudentInfo from "./components/StudentInfo";
import CameraPreview from "./components/CameraPreview";
import AIStatus from "./components/AIStatus";
import ControlButtons from "./components/ControlButtons";
import CapturedPages from "./components/CapturedPages";

import { startScan, uploadPage } from "./services/api";

function App() {
  const cameraRef = useRef();

  const [sessionId, setSessionId] = useState("--");

  const [pages, setPages] = useState([]);

  const [uploadStatus, setUploadStatus] = useState("Waiting");

  const [ocrStatus, setOcrStatus] = useState("Waiting");

  const [detectionStatus, setDetectionStatus] = useState("Waiting");

  const [evaluationStatus, setEvaluationStatus] = useState("Waiting");

  async function handleStartScan() {
    try {
      const data = await startScan();

      setSessionId(data.session_id);

      setPages([]);

      setUploadStatus("Ready");

      setOcrStatus("Waiting");

      setDetectionStatus("Waiting");

      setEvaluationStatus("Waiting");
    } catch {
      alert("Backend is not running.");
    }
  }

  async function handleCapture() {
    if (sessionId === "--") {
      alert("Please click Start Scan first.");
      return;
    }

    const captured = await cameraRef.current.captureImage();

    if (!captured) return;

    const pageNumber = pages.length + 1;

    const page = {
      pageNumber,
      image: captured.preview,
      status: "Uploading..."
    };

    setPages((previous) => [...previous, page]);

    setUploadStatus("Uploading");

    try {
      await uploadPage(
        sessionId,
        pageNumber,
        captured.blob
      );

      setPages((previous) =>
        previous.map((p) =>
          p.pageNumber === pageNumber
            ? {
                ...p,
                status: "Uploaded"
              }
            : p
        )
      );

      setUploadStatus("Uploaded");
    } catch (error) {
      console.error(error);

      setPages((previous) =>
        previous.map((p) =>
          p.pageNumber === pageNumber
            ? {
                ...p,
                status: "Upload Failed"
              }
            : p
        )
      );

      setUploadStatus("Failed");
    }
  }

  function handleFinishScan() {
    alert("Finish Scan feature will be implemented later.");
  }

  return (
    <div className="container">
      <Header />

      <div className="dashboard">
        <StudentInfo
          registerNumber="--"
          studentName="--"
          pagesCaptured={pages.length}
          sessionId={sessionId}
        />

        <div className="card">
          <h2>Live Camera</h2>

          <CameraPreview ref={cameraRef} />
        </div>

        <AIStatus
          uploadStatus={uploadStatus}
          ocrStatus={ocrStatus}
          detectionStatus={detectionStatus}
          evaluationStatus={evaluationStatus}
        />
      </div>

      <ControlButtons
        startScan={handleStartScan}
        capturePage={handleCapture}
        finishScan={handleFinishScan}
      />

      <CapturedPages pages={pages} />
    </div>
  );
}

export default App;