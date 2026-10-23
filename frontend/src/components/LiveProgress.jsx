function LiveProgress() {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

      <h2 className="text-white text-xl font-semibold mb-5">
        AI Processing
      </h2>

      <div className="space-y-5">

        <div>
          <div className="flex justify-between text-slate-300 mb-2">
            <span>OCR Engine</span>
            <span>Ready</span>
          </div>

          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="w-full h-full bg-green-500 rounded-full"/>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-2">
            <span>Question Detection</span>
            <span>Waiting</span>
          </div>

          <div className="h-2 bg-slate-800 rounded-full"/>
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-2">
            <span>Evaluation</span>
            <span>Waiting</span>
          </div>

          <div className="h-2 bg-slate-800 rounded-full"/>
        </div>

      </div>

    </div>

  );

}

export default LiveProgress;