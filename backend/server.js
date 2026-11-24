
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "CloudTasks API is running!",
    status: "success",
    platform: "Microsoft Azure"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "CloudTasks Backend"
  });
});

app.use("/api/tasks", taskRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CloudTasks API running on port ${PORT}`);
});
