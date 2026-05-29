import api from "./axios";

export async function fetchQuizzes() {
  const { data } = await api.get("/quizzes");
  return data;
}

export async function fetchQuizById(id: string) {
  const { data } = await api.get(`/quizzes/${id}`);
  return data;
}

export async function createQuiz(quizData: any) {
  const { data } = await api.post("/quizzes", quizData);
  return data;
}

export async function deleteQuiz(id: string) {
  const { data } = await api.delete(`/quizzes/${id}`);
  return data;
}
