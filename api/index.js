import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  console.log("▶️ 環境変数 DATABASE_URL =", process.env.DATABASE_URL);
  console.log("▶️ リクエストメソッド =", req.method);

  if (req.method === 'POST') {
    try {
      const { thread_id, content, tags } = req.body;
      console.log("📦 受信した内容：", req.body);

      await pool.query(
        'INSERT INTO memory_logs (thread_id, content, tags) VALUES ($1, $2, $3)',
        [thread_id, content, tags]
      );

      res.status(200).send("保存成功");
    } catch (error) {
      console.error("❌ 保存中にエラー:", error);
      res.status(500).send("保存失敗");
    }
  } else if (req.method === 'GET') {
    try {
      const { thread_id } = req.query;
      console.log("🔍 取得対象 thread_id =", thread_id);

      const result = await pool.query(
        'SELECT * FROM memory_logs WHERE thread_id = $1 ORDER BY created_at DESC LIMIT 1',
        [thread_id]
      );

      res.status(200).json(result.rows[0] || {});
    } catch (error) {
      console.error("❌ 取得中にエラー:", error);
      res.status(500).send("取得失敗");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
