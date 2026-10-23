function Navbar() {
  return (

    <div className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-10">

      <div>

        <h1 className="text-3xl font-bold text-white">

          AI Control Center

        </h1>

        <p className="text-slate-400">

          Welcome back, Teacher

        </p>

      </div>

      <div
        className="w-12 h-12 rounded-full
        bg-gradient-to-r
        from-blue-500
        to-cyan-500"
      />

    </div>

  );
}

export default Navbar;