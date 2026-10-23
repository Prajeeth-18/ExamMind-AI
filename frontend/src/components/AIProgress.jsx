function AIProgress({ progress = 0 }) {
  return (
    <div className="w-full mt-6">

      <div className="flex justify-between text-slate-400 text-sm mb-2">

        <span>AI Processing</span>

        <span>{progress}%</span>

      </div>

      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">

        <div
          style={{ width: `${progress}%` }}
          className="
          h-full

          bg-gradient-to-r

          from-blue-500

          via-cyan-400

          to-blue-500

          transition-all

          duration-700
          "
        />

      </div>

    </div>
  );
}

export default AIProgress;