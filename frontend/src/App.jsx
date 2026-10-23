import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CreateExam from "./pages/CreateExam";
import UploadQuestionPaper from "./pages/UploadQuestionPaper";
import UploadAnswerKey from "./pages/UploadAnswerKey";
import StudentEvaluation from "./pages/StudentEvaluation";
import Results from "./pages/Results";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/create-exam" element={<CreateExam />} />

        <Route
          path="/upload-question-paper"
          element={<UploadQuestionPaper />}
        />

        <Route
          path="/upload-answer-key"
          element={<UploadAnswerKey />}
        />

        <Route
          path="/student-evaluation"
          element={<StudentEvaluation />}
        />

        <Route path="/results" element={<Results />} />

        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;