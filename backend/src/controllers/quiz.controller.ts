import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  }),
});
export const createQuiz = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, questions } = req.body;

    const newQuiz = await prisma.quiz.create({
      data: {
        title,
        description,
        questions: {
          create: questions.map((q: any) => ({
            type: q.type,
            question: q.question,
            correctAnswer: q.correctAnswer,
            options: JSON.stringify(q.options),
          })),
        },
      },
      include: { questions: true },
    });

    const formattedQuiz = {
      ...newQuiz,
      questions: newQuiz.questions.map((q) => ({
        ...q,
        options: JSON.parse(q.options),
      })),
    };

    res.status(201).json(formattedQuiz);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllQuizzes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    const result = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      questionsCount: quiz._count.questions,
      createdAt: quiz.createdAt,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getQuizById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    const formattedQuiz = {
      ...quiz,
      questions: quiz.questions.map((q) => ({
        ...q,
        options: JSON.parse(q.options),
      })),
    };

    res.status(200).json(formattedQuiz);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteQuiz = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await prisma.quiz.delete({
      where: { id },
    });

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Quiz not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
