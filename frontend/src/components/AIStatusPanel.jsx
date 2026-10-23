import {
  CheckCircle2,
  LoaderCircle,
  Circle,
} from "lucide-react";

import { useScannerState } from "../hooks/useScannerState";

function AIStatusPanel() {
  const { scannerState, pageNumber } = useScannerState();

  const steps = [
    {
      state: "SEARCHING_PAPER",
      title: "Searching for Paper",
    },
    {
      state: "PAPER_DETECTED",
      title: "Paper Detected",
    },
    {
      state: "CHECKING_BLUR",
      title: "Checking Blur",
    },
    {
      state: "CHECKING_LIGHTING",
      title: "Lighting Analysis",
    },
    {
      state: "WAITING_STABILITY",
      title: "Stability Check",
    },
    {
      state: "AUTO_CAPTURE",
      title: "Auto Capture",
    },
    {
      state: "PAGE_CAPTURED",
      title: `Page ${pageNumber - 1} Captured Successfully`,
    },
  ];

  console.log("Timeline State =", scannerState);

  const currentStep = steps.findIndex(
    (step) => step.state === scannerState
  );

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
      <h2 className="text-white text-xl font-bold mb-8">
        🤖 AI Processing Timeline
      </h2>

      <div className="relative">
        {steps.map((step, index) => (
          <div
            key={step.state}
            className="flex items-start gap-4 relative pb-8"
          >
            {index !== steps.length - 1 && (
              <div className="absolute left-[15px] top-8 w-[2px] h-10 bg-slate-700" />
            )}

            <div className="z-10">
              {step.state === "PAGE_CAPTURED" &&
              scannerState === "PAGE_CAPTURED" ? (
                <CheckCircle2
                  size={30}
                  className="text-green-400"
                />
              ) : index < currentStep ? (
                <CheckCircle2
                  size={30}
                  className="text-green-400"
                />
              ) : index === currentStep ? (
                <LoaderCircle
                  size={30}
                  className="text-cyan-400 animate-spin"
                />
              ) : (
                <Circle
                  size={30}
                  className="text-slate-600"
                />
              )}
            </div>

            <div>
              <h3
                className={`font-semibold text-lg ${
                  index < currentStep
                    ? "text-green-400"
                    : index === currentStep
                    ? "text-cyan-400"
                    : "text-slate-500"
                }`}
              >
                {step.title}
              </h3>

              <p className="text-sm mt-1 text-slate-400">
                {step.state === "PAGE_CAPTURED" &&
                index === currentStep
                  ? "Remove this page and place the next page"
                  : index < currentStep
                  ? "Completed"
                  : index === currentStep
                  ? "Processing..."
                  : "Waiting"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIStatusPanel;