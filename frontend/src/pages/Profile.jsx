import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Profile() {
  return (
    <div className="flex bg-[#050816] min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-10">

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-10">

            <h1 className="text-4xl font-bold text-white">
              Teacher Profile
            </h1>

            <div className="mt-10 space-y-6">

              <div>
                <p className="text-slate-400">Teacher Name</p>
                <h2 className="text-white text-2xl">
                  Dr. Priya
                </h2>
              </div>

              <div>
                <p className="text-slate-400">Department</p>
                <h2 className="text-white text-2xl">
                  Computer Science
                </h2>
              </div>

              <div>
                <p className="text-slate-400">Email</p>
                <h2 className="text-white text-2xl">
                  teacher@college.edu
                </h2>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;