import { useEffect, useState } from "react";
import { Bot, Camera, FileText, Lightbulb, ScanLine } from "lucide-react";

const messages = [
  {
    icon: Camera,
    title: "Camera Connected",
    text: "Live camera feed is active.",
  },
  {
    icon: FileText,
    title: "Place Answer Sheet",
    text: "Align the paper inside the green frame.",
  },
  {
    icon: Lightbulb,
    title: "Lighting Check",
    text: "Avoid shadows and reflections.",
  },
  {
    icon: ScanLine,
    title: "Ready",
    text: "AI will automatically capture when stable.",
  },
];

function AIAssistant() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((old) => (old + 1) % messages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const Item = messages[current].icon;

  return (
    <div className="mt-6 bg-slate-900 border border-slate-800 rounded-3xl p-6">

      <div className="flex items-center gap-3 mb-5">

        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">

          <Bot className="text-white" size={24} />

        </div>

        <div>

          <h2 className="text-white text-xl font-bold">

            AI Assistant

          </h2>

          <p className="text-slate-400 text-sm">

            Real-time scanning guidance

          </p>

        </div>

      </div>

      <div className="flex items-start gap-4">

        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">

          <Item className="text-cyan-400" size={24} />

        </div>

        <div>

          <h3 className="text-white font-semibold text-lg">

            {messages[current].title}

          </h3>

          <p className="text-slate-400 mt-1">

            {messages[current].text}

          </p>

        </div>

      </div>

    </div>
  );
}

export default AIAssistant;