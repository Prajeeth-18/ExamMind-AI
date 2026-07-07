function ControlButtons({

    startScan,

    capturePage,

    finishScan

}) {

    return (

        <div className="buttons">

            <button onClick={startScan}>

                ▶ Start Scan

            </button>

            <button onClick={capturePage}>

                📸 Capture

            </button>

            <button onClick={finishScan}>

                ✅ Finish Scan

            </button>

        </div>

    );

}

export default ControlButtons;