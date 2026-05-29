import "dotenv/config";
import express from "express";
import cors from "cors";
import quizRoutes from "./routes/quiz.routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/quizzes", quizRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
