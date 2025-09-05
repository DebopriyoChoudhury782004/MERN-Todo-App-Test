const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/email"); // 👈 added
const User = require("../models/User");      // 👈 still here in case you need it elsewhere

// ✅ Test email route
router.get("/test-email", async (req, res) => {
  try {
    const result = await sendEmail(
      "yourRealEmail@gmail.com", // 👈 replace with your real email
      "Test Email 🚀",
      "This is a test email from Nodemailer!"
    );

    if (result) {
      res.send("✅ Email was sent successfully! Check your inbox/spam.");
    } else {
      res.status(500).send("❌ Failed to send email. Check server logs.");
    }
  } catch (error) {
    console.error("❌ Error in /test-email:", error.message);
    res.status(500).send("❌ Unexpected error occurred.");
  }
});

// Get all todos for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ order: 1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Add new todo
router.post("/", authMiddleware, async (req, res) => {
  console.log("🔔 Reached POST /todos route. req.user:", req.user);
  console.log("🔐 POST /todos");
  console.log("🧑 req.user:", req.user);
  console.log("📦 req.body:", req.body);

  try {
    const count = await Todo.countDocuments({ user: req.user.id });

    const todoData = {
      user: req.user.id,
      text: req.body.text,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      order: count,
    };

    if (typeof req.body.dueTime === "string" && req.body.dueTime.trim() !== "") {
      todoData.dueTime = req.body.dueTime.trim();
    }

    const todo = new Todo(todoData);
    await todo.save();

    // ✅ Use email from token instead of DB lookup
    if (req.user?.email) {
      console.log(`📧 Sending new-task email to: ${req.user.email}`);
      const dueDateStr = req.body.dueDate || "No date";
      const dueTimeStr = req.body.dueTime?.trim() || "No time";

      await sendEmail(
        req.user.email,
        "New Task Added 🎯",
        `You added a new task: "${req.body.text}".\nDue on: ${dueDateStr} at ${dueTimeStr}`
      );
    }

    console.log("✅ Todo saved:", todo);
    res.status(201).json(todo);
  } catch (err) {
    console.error("❌ Failed to create todo:", err.message);
    res.status(500).json({ error: "Failed to create todo", details: err.message });
  }
});

// Update a todo
router.put("/:id", authMiddleware, async (req, res) => {
  console.log("🔔 Reached PUT /todos/:id route. req.user:", req.user);
  try {
    let { text, priority, dueDate, dueTime, completed } = req.body;

    if (typeof completed !== "undefined") {
      completed = completed === true || completed === "true";
    }

    const existingTodo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!existingTodo) {
      return res.status(404).json({ error: "Todo not found or unauthorized" });
    }

    if (existingTodo.completed && completed === false) {
      return res.status(400).json({ error: "Completed tasks cannot be marked as incomplete" });
    }

    const updateFields = {};
    if (typeof text !== "undefined") updateFields.text = text;
    if (typeof priority !== "undefined") updateFields.priority = priority;
    if (typeof dueDate !== "undefined") updateFields.dueDate = dueDate;

    if (typeof dueTime !== "undefined") {
      if (typeof dueTime === "string" && dueTime.trim() === "") {
        updateFields.dueTime = null; // clear field if empty string
      } else {
        updateFields.dueTime = dueTime;
      }
    }

    if (!existingTodo.completed && typeof completed !== "undefined") {
      updateFields.completed = completed;
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updateFields },
      { new: true }
    );

    // ✅ Send email when task is marked as completed
    if (!existingTodo.completed && updatedTodo.completed) {
      if (req.user?.email) {
        console.log(`📧 Sending completion email to: ${req.user.email}`);
        const dueDateStr = updatedTodo.dueDate || "No date";
        const dueTimeStr = updatedTodo.dueTime || "No time";

        await sendEmail(
          req.user.email,
          "Task Completed ✅",
          `Great job! You marked the task "${updatedTodo.text}" as completed.\nIt was due on: ${dueDateStr} at ${dueTimeStr}`
        );
      }
    }

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) return res.status(404).json({ error: "Todo not found or unauthorized" });

    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

module.exports = router;
