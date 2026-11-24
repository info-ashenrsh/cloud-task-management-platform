
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Failed to retrieve tasks." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description = "", priority = "Medium" } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required."
      });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, priority)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title.trim(), description, priority]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Failed to create task." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    const taskId = req.params.id;

    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           priority = COALESCE($4, priority)
       WHERE id = $5
       RETURNING *`,
      [title, description, status, priority, taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found."
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Failed to update task." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found."
      });
    }

    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Failed to delete task." });
  }
});

export default router;
