import {
  LayoutDashboard,
  FilePlus,
  FileText,
  BookOpen,
  Camera,
  BarChart3,
  User,
  LogOut
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();

  const location = useLocation();

  const menus = [

    {
      icon: LayoutDashboard,
      title: "Dashboard",
      path: "/dashboard"
    },

    {
      icon: FilePlus,
      title: "Create Exam",
      path: "/create-exam"
    },

    {
      icon: FileText,
      title: "Question Paper",
      path: "/upload-question-paper"
    },

    {
      icon: BookOpen,
      title: "Answer Key",
      path: "/upload-answer-key"
    },

    {
      icon: Camera,
      title: "AI Scan Room",
      path: "/student-evaluation"
    },

    {
      icon: BarChart3,
      title: "Results",
      path: "/results"
    },

    {
      icon: User,
      title: "Profile",
      path: "/profile"
    }

  ];

  return (

    <div className="w-72 h-screen bg-slate-950 border-r border-slate-800 flex flex-col">

      <div className="p-8">

        <h1 className="text-3xl font-bold text-white">

          ExamMind

        </h1>

        <p className="text-slate-400 mt-2">

          AI Evaluation Platform

        </p>

      </div>

      <div className="flex-1 px-4">

        {

          menus.map((menu, index) => {

            const Icon = menu.icon;

            const active = location.pathname === menu.path;

            return (

              <div

                key={index}

                onClick={() => navigate(menu.path)}

                className={`

                flex

                items-center

                gap-4

                p-4

                rounded-xl

                cursor-pointer

                duration-300

                mb-2

                ${

                  active

                  ?

                  "bg-blue-600 text-white"

                  :

                  "text-slate-300 hover:bg-blue-600 hover:text-white"

                }

                `}

              >

                <Icon size={22}/>

                {menu.title}

              </div>

            );

          })

        }

      </div>

      <div className="p-5">

        <button

          className="w-full

          p-4

          rounded-xl

          bg-red-500

          hover:bg-red-600

          text-white

          flex

          justify-center

          items-center

          gap-3"

        >

          <LogOut size={20}/>

          Logout

        </button>

      </div>

    </div>

  );

}

export default Sidebar;