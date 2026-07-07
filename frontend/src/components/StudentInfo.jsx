function StudentInfo({

    registerNumber,

    studentName,

    pagesCaptured,

    sessionId

}) {

    return (

        <div className="card">

            <h2>Student Information</h2>

            <p>

                <strong>Register No :</strong>

                {" "}

                {registerNumber}

            </p>

            <p>

                <strong>Student Name :</strong>

                {" "}

                {studentName}

            </p>

            <p>

                <strong>Pages Captured :</strong>

                {" "}

                {pagesCaptured}

            </p>

            <p>

                <strong>Session :</strong>

            </p>

            <p>{sessionId}</p>

        </div>

    );

}

export default StudentInfo;