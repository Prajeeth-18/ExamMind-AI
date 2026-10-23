import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FileText,
  Users,
  Brain,
  Award
} from "lucide-react";

function Dashboard() {

  const cards = [
    {
      title: "Total Exams",
      value: "12",
      icon: FileText,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Students Evaluated",
      value: "348",
      icon: Users,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "AI Evaluations",
      value: "982",
      icon: Brain,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Average Accuracy",
      value: "96%",
      icon: Award,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (

    <div className="flex bg-[#050816] min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <div className="grid grid-cols-4 gap-6">

            {cards.map((card, index) => {

              const Icon = card.icon;

              return (

                <div
                  key={index}
                  className="bg-slate-900 rounded-3xl p-7 border border-slate-800
                  hover:border-blue-500 duration-300 hover:scale-105"
                >

                  <div
                    className={`w-16 h-16 rounded-2xl
                    bg-gradient-to-r ${card.color}
                    flex items-center justify-center`}
                  >

                    <Icon size={30} color="white"/>

                  </div>

                  <h2 className="text-slate-400 mt-6">

                    {card.title}

                  </h2>

                  <h1 className="text-5xl font-bold text-white mt-2">

                    {card.value}

                  </h1>

                </div>

              );

            })}

          </div>

          <div className="grid grid-cols-2 gap-6 mt-8">

            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">

              <h2 className="text-2xl font-bold text-white">

                Recent Exams

              </h2>

              <div className="mt-6 space-y-4">

                <div className="bg-slate-800 rounded-xl p-5">

                  <h3 className="text-white font-semibold">

                    Artificial Intelligence Mid-1

                  </h3>

                  <p className="text-slate-400 mt-2">

                    42 Students Evaluated

                  </p>

                </div>

                <div className="bg-slate-800 rounded-xl p-5">

                  <h3 className="text-white font-semibold">

                    Deep Learning Internal

                  </h3>

                  <p className="text-slate-400 mt-2">

                    38 Students Evaluated

                  </p>

                </div>

              </div>

            </div>

            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">

              <h2 className="text-2xl font-bold text-white">

                AI Status

              </h2>

              <div className="space-y-5 mt-8">

                <div className="flex justify-between">

                  <span className="text-slate-300">

                    Gemini AI

                  </span>

                  <span className="text-green-400">

                    ● Online

                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-300">

                    OCR Engine

                  </span>

                  <span className="text-green-400">

                    ● Ready

                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-300">

                    Scanner

                  </span>

                  <span className="text-yellow-400">

                    ● Waiting

                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-300">

                    Evaluation

                  </span>

                  <span className="text-green-400">

                    ● Active

                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;