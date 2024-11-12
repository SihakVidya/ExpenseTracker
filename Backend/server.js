const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Route to get all expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM expenses ORDER BY date DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to add a new expense
app.post("/api/expenses", async (req, res) => {
  const { description, amount } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO expenses (description, amount) VALUES ($1, $2) RETURNING *",
      [description, amount]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Delete expense by `id` from the database
    const result = await pool.query(
      "DELETE FROM expenses WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

app.put("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const { description, amount, date } = req.body;
  try {
    const result = await pool.query(
      "UPDATE expenses SET description = $1, amount = $2, date = $3 WHERE id = $4 RETURNING *",
      [description, amount, date, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
