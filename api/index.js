import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// 環境変数チェック
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL が読み込めていません！");
} else {
  console.log("✅ DATABASE_URL を取得しました");
}

// PostgreSQL接続
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 保存エンドポイント（POST）
app.post("/neon/memory", async (req, res) => {
  try {
    const { thread_id, content, tags } = req.body;
    await pool.query(
      "INSERT INTO memory_logs (thread_id, content, tags) VALUES ($1, $2, $3)",
      [thread_id, content, tags]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ 保存中にエラー:", error);
    res.status(500).send("サーバーエラー（保存失敗）");
  }
});

// 取得エンドポイント（GET）
app.get("/neon/memory", async (req, res) => {
  try {
    const { thread_id } = req.query;
    const result = await pool.query(
      "SELECT * FROM memory_logs WHERE thread_id = $1 ORDER BY created_at DESC LIMIT 1",
      [thread_id]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error("❌ 取得中にエラー:", error);
    res.status(500).send("サーバーエラー（取得失敗）");
  }
});

// サーバー起動
app.listen(3000, () => {
  console.log("🚀 APIサーバー起動中（ポート3000）");
});
