import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.post("/neon/memory", async (req, res) => {
  const { thread_id, content, tags } = req.body;
  await pool.query(
    "INSERT INTO memory_logs (thread_id, content, tags) VALUES ($1, $2, $3)",
    [thread_id, content, tags]
  );
  res.sendStatus(200);
});

app.get("/neon/memory", async (req, res) => {
  const { thread_id } = req.query;
  const result = await pool.query(
    "SELECT * FROM memory_logs WHERE thread_id = $1 ORDER BY id DESC LIMIT 1",
    [thread_id]
  );
  res.json(result.rows[0] || {});
});

// ✅ listen不要 → exportすることでVercelに対応
export default app;
