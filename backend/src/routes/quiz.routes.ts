// routes/quiz.routes.ts
import { Router } from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  deleteQuiz,
} from "../controllers/quiz.controller";

const router = Router();

router.post("/", createQuiz); // POST /quizzes/
router.get("/", getAllQuizzes); // GET /quizzes/
router.get("/:id", getQuizById); // GET /quizzes/:id
router.delete("/:id", deleteQuiz); // DELETE /quizzes/:id

export default router;
