function CameraOverlay() {

  return (

    <>

      {/* Scanning Line */}

      <div
        className="
        absolute
        top-0
        left-0
        w-full
        h-1

        bg-cyan-400

        animate-pulse

        shadow-lg

        shadow-cyan-500
        "
      />

      {/* Detection Rectangle */}

      <div
        className="
        absolute

        left-1/2

        top-1/2

        -translate-x-1/2

        -translate-y-1/2

        w-[72%]

        h-[82%]

        rounded-2xl

        border-4

        border-green-400

        shadow-[0_0_40px_rgba(34,197,94,0.8)]

        pointer-events-none
        "
      >

        {/* Corners */}

        <div className="absolute -top-1 -left-1 w-10 h-10 border-l-4 border-t-4 border-green-400 rounded-tl-xl"/>

        <div className="absolute -top-1 -right-1 w-10 h-10 border-r-4 border-t-4 border-green-400 rounded-tr-xl"/>

        <div className="absolute -bottom-1 -left-1 w-10 h-10 border-l-4 border-b-4 border-green-400 rounded-bl-xl"/>

        <div className="absolute -bottom-1 -right-1 w-10 h-10 border-r-4 border-b-4 border-green-400 rounded-br-xl"/>

      </div>

      {/* AI Label */}

      <div
        className="
        absolute

        top-8

        left-8

        px-4

        py-2

        rounded-full

        bg-green-500/20

        border

        border-green-400

        text-green-300

        font-semibold
        "
      >

        🤖 AI Ready

      </div>

    </>

  );

}

export default CameraOverlay;