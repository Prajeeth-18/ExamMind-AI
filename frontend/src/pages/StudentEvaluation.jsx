import { useCallback, useEffect, useRef, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import ScannerHeader from "../components/ScannerHeader";
import CameraPreview from "../components/CameraPreview";
import CameraOverlay from "../components/CameraOverlay";
import FrameProcessor from "../components/FrameProcessor";
import AIStatusPanel from "../components/AIStatusPanel";
import LiveProgress from "../components/LiveProgress";
import AIAssistant from "../components/AIAssistant";

import {
  startScan,
  finishScan,
  getScanStatus
} from "../services/api";import { useNavigate } from "react-router-dom";

function StudentEvaluation() {

  const cameraRef = useRef();
  const stopScanRef = useRef(false);
const scannerStoppedResolver = useRef(null);


const handleScannerStopped = useCallback(() => {
  console.log("Scanner loop stopped.");

  if (scannerStoppedResolver.current) {
    scannerStoppedResolver.current();
    scannerStoppedResolver.current = null;
  }
}, []);

  const [pages] = useState([]);

  const [sessionId, setSessionId] = useState(null);
  const navigate = useNavigate();

const [evaluating, setEvaluating] = useState(false);


async function handleFinishScan() {
  if (!sessionId) {
    alert("Session not ready.");
    return;
  }

  if (evaluating) return;

  setEvaluating(true);

  try {
    console.log("Stopping scanner...");

    // If the scanner has already stopped, don't wait again.
    if (!stopScanRef.current) {
      const scannerStopped = new Promise((resolve) => {
        scannerStoppedResolver.current = resolve;
      });

      stopScanRef.current = true;
      console.log("FINISH CLICKED — STOP SIGNAL:", stopScanRef.current);

      await scannerStopped;
    }

    console.log("Scanner stopped. Waiting for OCR...");

    // Wait for queued OCR work to finish.
    while (true) {
      const status = await getScanStatus(sessionId);
      console.log("Scan status:", status);

      if (!status.processing) break;

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("OCR completed. Starting evaluation...");

    const result = await finishScan(sessionId);

    console.log("Evaluation Result:", result);

    sessionStorage.setItem(
      "evaluation_result",
      JSON.stringify(result)
    );

    navigate("/results");
  } catch (err) {
    console.error("Finish and evaluation failed:", err);
    alert("Evaluation failed. Check the backend terminal.");
  } finally {
    setEvaluating(false);
  }
}


  useEffect(() => {

    async function createScanSession() {

      try {

        const examId = localStorage.getItem("exam_id");

        if (!examId) {

          alert("No Exam Found");

          return;

        }

        const response = await startScan(examId);

        console.log("Scan Session Created:", response);

        setSessionId(response.session_id);

      }

      catch (error) {

        console.error(error);

        alert("Unable to create scan session.");

      }

    }

    createScanSession();

  }, []);

  return (

    <div className="flex min-h-screen bg-[#050816]">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <ScannerHeader />

          <div className="grid grid-cols-12 gap-8">

            {/* ================= LEFT SIDE ================= */}

            <div className="col-span-8">

              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">

                <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800">

                  <div>

                    <h2 className="text-2xl font-bold text-white">
                      Live Camera Feed
                    </h2>

                    <p className="text-slate-400 mt-1">
                      Position the answer sheet inside the green frame.
                    </p>

                  </div>

                  <div className="px-5 py-2 rounded-full bg-green-500/20 text-green-400 font-semibold animate-pulse">
                    ● LIVE
                  </div>

                </div>

                <div className="relative aspect-video bg-black">

                  <CameraPreview ref={cameraRef} />

                  <CameraOverlay />

                  <FrameProcessor
  cameraRef={cameraRef}
  sessionId={sessionId}
  stopSignalRef={stopScanRef}
  onStopped={handleScannerStopped}
/>

                </div>

              </div>

              <AIAssistant />

            </div>

            {/* ================= RIGHT SIDE ================= */}

            <div className="col-span-4 space-y-6">

              <AIStatusPanel />

              <LiveProgress />

            </div>

          </div>

          {/* ================= CAPTURED PAGES ================= */}

          <div className="mt-8">

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

              <div className="flex justify-between items-center">

                <h2 className="text-2xl font-bold text-white">
                  Captured Pages
                </h2>

                <span className="text-cyan-400 font-semibold">
                  {pages.length} Page(s)
                </span>

              </div>

              <div className="mt-6">

                {pages.length === 0 ? (

                  <div className="text-center py-12">

                    <div className="text-6xl mb-4">
                      📄
                    </div>

                    <h3 className="text-xl text-white">
                      Waiting for first page...
                    </h3>

                    <p className="text-slate-400 mt-2">
                      AI will automatically detect and capture pages.
                    </p>

                  </div>

                ) : (

                  <div className="grid grid-cols-4 gap-4">

  {pages.map((page, index) => (

    <div
      key={index}
      className="bg-slate-800 rounded-2xl p-4 border border-slate-700"
    >

      <div className="aspect-[3/4] rounded-xl bg-slate-700 mb-3" />

      <h4 className="text-white">
        Page {index + 1}
      </h4>

      <p className="text-green-400 text-sm mt-1">
        ✓ Captured
      </p>

    </div>

  ))}

</div>

)}

</div>

</div>

</div>

{/* ================= FINISH SCAN BUTTON ================= */}

<div className="mt-8 flex justify-center">

  <button
    onClick={handleFinishScan}
    disabled={evaluating}
    className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-xl font-semibold"
  >
    {evaluating ? "Evaluating..." : "Finish Scan & Evaluate"}
  </button>

</div>

</div>

</div>

</div>

);

}

export default StudentEvaluation;