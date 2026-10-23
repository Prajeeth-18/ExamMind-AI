import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export async function createExam(examName) {
  const response = await API.post("/create-exam", {
    exam_name: examName,
  });

  return response.data;
}

export async function uploadQuestionPaper(examId, file) {
  const formData = new FormData();

  formData.append("exam_id", examId);
  formData.append("file", file);

  const response = await API.post(
    "/upload-question-paper",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function uploadAnswerKey(examId, file) {
  const formData = new FormData();

  formData.append("exam_id", examId);
  formData.append("file", file);

  const response = await API.post(
    "/upload-answer-key",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}