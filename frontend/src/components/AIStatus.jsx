function AIStatus({

    uploadStatus,

    ocrStatus,

    detectionStatus,

    evaluationStatus

}) {

    return (

        <div className="card">

            <h2>AI Processing</h2>

            <p>

                Upload :

                {" "}

                {uploadStatus}

            </p>

            <p>

                OCR :

                {" "}

                {ocrStatus}

            </p>

            <p>

                Question Detection :

                {" "}

                {detectionStatus}

            </p>

            <p>

                Evaluation :

                {" "}

                {evaluationStatus}

            </p>

        </div>

    );

}

export default AIStatus;