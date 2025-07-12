import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { thread_id, content, tags } = req.body;
    await pool.query(
      "INSERT INTO memory_logs (thread_id, content, tags) VALUES ($1, $2, $3)",
      [thread_id, content, tags]
    );
    res.status(200).json({ status: "saved" });
  } else if (req.method === 'GET') {
    const { thread_id } = req.query;
    const result = await pool.query(
      "SELECT * FROM memory_logs WHERE thread_id = $1 ORDER BY id DESC LIMIT 1",
      [thread_id]
    );
    res.status(200).json(result.rows[0] || {});
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
