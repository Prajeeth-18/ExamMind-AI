import { ScanLine } from "lucide-react";

function ScannerHeader() {
  return (
    <div className="mb-8">

      <div className="flex items-center gap-4">

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">

          <ScanLine size={34} className="text-white"/>

        </div>

        <div>

          <h1 className="text-4xl font-bold text-white">
            AI Smart Scanner
          </h1>

          <p className="text-slate-400 mt-1">
            Intelligent Answer Sheet Detection & Evaluation
          </p>

        </div>

      </div>

    </div>
  );
}

export default ScannerHeader;